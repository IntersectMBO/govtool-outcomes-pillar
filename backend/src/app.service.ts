import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  availableEndpoints() {
    return {
      apiName: "Governance Action Outcomes API",
      availableEndpoints: [
        {
          path: "/governance-actions",
          method: "GET",
          description:
            "Get all governance actions with optional filtering and pagination",
          queryParams: ["search", "filters", "sort", "page", "limit"],
        },
        {
          path: "/governance-actions/metadata",
          method: "GET",
          description:
            "Get metadata for a specific governance action using its metadata url",
          queryParams: ["url"],
        },
        {
          path: "/governance-actions/:id",
          method: "GET",
          description: "Get a specific governance action by ID(tx_hash#index)",
          pathParams: ["id"],
          queryParams: ["index"],
        },
      ],
    };
  }
}
