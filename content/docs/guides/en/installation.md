## Two deliberate runtime profiles

V3 compatibility is a model-disabled lexical core. Its Compose file separates API and worker roles. V4 canonical processing requires one model-enabled combined storage owner. Do not mount the same physical root into two writers or share it between V3 and V4.

## Install only the extras you need

The locked development extra installs the local testing environment. Add `ml` for local model execution and `adapters` when the selected provider needs its SDK. Do not load model packages merely to run the V3 quickstart. [Configure providers](docs/core/embedding-providers/) before V4 writes.

## Protect the deployment boundary

Provision credentials and ACLs before startup. Set an explicit application-owned storage root and `MESA_LOAD_DOTENV=false`. The process launcher binds internally to all interfaces; loopback publishing, TLS and an authenticated reverse proxy are deployment responsibilities. Never treat a successful boot as production qualification.
