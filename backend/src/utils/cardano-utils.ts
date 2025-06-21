import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import * as blakejs from "blakejs";
import * as cbor from "cbor";
import { SignatureVerificationResult } from "src/types/signature.types";

const regExpHex = /^[0-9a-fA-F]+$/;

/**
 * Trim whitespace from string
 */
export function trimString(s: string): string {
  s = s.replace(/(^\s*)|(\s*$)/gi, "");
  s = s.replace(/\n /, "\n");
  return s;
}
export function getPublicKeyFromVkey(vkey: string): CardanoWasm.PublicKey {
  try {
    return CardanoWasm.PublicKey.from_bytes(Buffer.from(vkey, "hex"));
  } catch (error) {
    throw new Error(`Invalid vkey format: ${error.message}`);
  }
}

export async function verifyCIP8Signature(payload: {
  vkey: string;
  signature: string;
  message?: Uint8Array;
}): Promise<SignatureVerificationResult> {
  try {
    // Validate COSE_Key presence and format
    let COSE_Key_cbor_hex = payload?.vkey;
    if (typeof COSE_Key_cbor_hex === "undefined") {
      throw new Error("Missing COSE_Key parameter signature.vkey");
    }

    COSE_Key_cbor_hex = trimString(COSE_Key_cbor_hex.toLowerCase());

    // Check hex validity
    if (!regExpHex.test(COSE_Key_cbor_hex)) {
      throw new Error("COSE_Key is not a valid hex string");
    }

    // Validate COSE_Sign1 presence and format
    let COSE_Sign1_cbor_hex = payload?.signature;
    if (typeof COSE_Sign1_cbor_hex === "undefined") {
      throw new Error(
        "Missing COSE_Sign1 signature parameter signatures.signature"
      );
    }

    COSE_Sign1_cbor_hex = trimString(COSE_Sign1_cbor_hex.toLowerCase());

    // Check hex validity
    if (!regExpHex.test(COSE_Sign1_cbor_hex)) {
      throw new Error("COSE_Sign1 is not a valid hex string");
    }

    let COSE_Key_structure;
    let publicKey: CardanoWasm.PublicKey | undefined;
    try {
      COSE_Key_structure = cbor.decode(Buffer.from(COSE_Key_cbor_hex, "hex"));
    } catch (error) {
      try {
        publicKey = getPublicKeyFromVkey(COSE_Key_cbor_hex);
      } catch (error) {
        throw new Error(
          `Can't cbor decode the given COSE_Key signature (${error})`
        );
      }
    }

    if (!publicKey && COSE_Key_structure) {
      // Validate COSE Key structure
      if (!(COSE_Key_structure instanceof Map) || COSE_Key_structure.size < 4) {
        throw new Error(
          "COSE_Key is not valid. It must be a map with at least 4 entries: kty,alg,crv,x."
        );
      }
      if (COSE_Key_structure.get(1) !== 1) {
        throw new Error('COSE_Key map label "1" (kty) is not "1" (OKP)');
      }
      if (COSE_Key_structure.get(3) !== -8) {
        throw new Error('COSE_Key map label "3" (alg) is not "-8" (EdDSA)');
      }
      if (COSE_Key_structure.get(-1) !== 6) {
        throw new Error('COSE_Key map label "-1" (crv) is not "6" (Ed25519)');
      }
      if (!COSE_Key_structure.has(-2)) {
        throw new Error('COSE_Key map label "-2" (public key) is missing');
      }
      const pubKey_buffer = COSE_Key_structure.get(-2);
      if (!Buffer.isBuffer(pubKey_buffer)) {
        throw new Error("PublicKey entry in the COSE_Key is not a bytearray");
      }
      const pubKey = pubKey_buffer.toString("hex");
      publicKey = CardanoWasm.PublicKey.from_bytes(Buffer.from(pubKey, "hex"));
    }
    if (!publicKey) {
      throw new Error("Public key could not be derived from COSE_Key");
    }

    // Decode COSE_Sign1
    let COSE_Sign1_structure;
    try {
      COSE_Sign1_structure = cbor.decode(
        Buffer.from(COSE_Sign1_cbor_hex, "hex")
      );
    } catch (error) {
      throw new Error(
        `Can't cbor decode the given COSE_Sign1 signature (${error})`
      );
    }

    // Validate COSE_Sign1 structure
    if (
      !Array.isArray(COSE_Sign1_structure) ||
      COSE_Sign1_structure.length !== 4
    ) {
      throw new Error(
        "COSE_Sign1 is not a valid signature. It must be an array with 4 entries."
      );
    }

    // Extract content from COSE_Sign1_structure
    const [
      protectedHeader_buffer,
      unprotectedHeader,
      payload_buffer,
      signature_buffer,
    ] = COSE_Sign1_structure;

    // 1) Validate and decode protected header
    if (!Buffer.isBuffer(protectedHeader_buffer)) {
      throw new Error("Protected header is not a bytearray (serialized) cbor");
    }

    let protectedHeader;
    try {
      protectedHeader = cbor.decode(protectedHeader_buffer);
    } catch (error) {
      throw new Error(`Can't cbor decode the protected header (${error})`);
    }

    if (!protectedHeader.has(1)) {
      throw new Error('Protected header map label "1" is missing');
    }
    if (protectedHeader.get(1) !== -8) {
      throw new Error(
        'Protected header map label "1" (alg) is not "-8" (EdDSA)'
      );
    }
    if (!protectedHeader.has("address")) {
      throw new Error('Protected header map label "address" is missing');
    }

    // 2) Process unprotectedHeader as in executable
    let unprotectedHeader_processed = unprotectedHeader;
    if (
      !(unprotectedHeader instanceof Map) &&
      typeof unprotectedHeader === "object"
    ) {
      unprotectedHeader_processed = new Map(Object.entries(unprotectedHeader));
    }
    if (!(unprotectedHeader_processed instanceof Map)) {
      throw new Error("Unprotected header is not a map");
    }

    // Create Sig_structure
    let Sig_structure = [
      "Signature1",
      protectedHeader_buffer,
      Buffer.from(""),
      payload_buffer,
    ];

    if (payload?.message) {
      const messageHash = blakejs.blake2b(payload.message, undefined, 32);
      const messageHashHex = Buffer.from(messageHash).toString("hex");
      const payloadHex = payload_buffer.toString("hex");

      // Verify that the payload in the signature matches your hashed message
      if (messageHashHex !== payloadHex) {
        return {
          isValid: false,
          message: "Signature verification failed",
          error: "Payload in signature does not match hash of provided message",
        };
      }
    }

    // Convert to CBOR for verification (using original structure)
    const Sig_structure_cbor_hex = cbor.encode(Sig_structure).toString("hex");

    // Load signature
    if (!Buffer.isBuffer(signature_buffer)) {
      throw new Error("Signature is not a bytearray");
    }
    const signature_hex = signature_buffer.toString("hex");
    const ed25519signature =
      CardanoWasm.Ed25519Signature.from_hex(signature_hex);

    // Verify signature
    const isValid = publicKey.verify(
      Buffer.from(Sig_structure_cbor_hex, "hex"),
      ed25519signature
    );

    return {
      isValid,
      message: isValid ? "Signature is valid" : "Signature verification failed",
    };
  } catch (error) {
    throw new Error(error.message || "Signature verification failed");
  }
}
