## Purpose and boundaries

Rebuild is a default-disabled, ADMIN-only control-plane operation over the entire storage root. Admission, checkpointed offline replay, verification and cutover are separate stages. Flag-off submission is 501; unsupported scoped requests are 409. Preserve canonical ownership and backup; never describe this as an online per-tenant repair.

## Continue with the maintained contracts

Use the pinned source reference below for complete tables and operator details. Related guides: [architecture](architecture/), [API](docs/core/api-reference/), [operations](docs/core/operations/) and [release limits](docs/core/limitations/).
