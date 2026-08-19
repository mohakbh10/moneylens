
from fastapi import (
    Depends,
    HTTPException,
)

from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)

from services.supabase_service import supabase

# FastAPI Bearer authentication scheme
security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security)
):
    # Authorization header must look like:
    # Bearer <access_token>

    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Unauthorized",
        )

    token = credentials.credentials
    try:

        # Supabase verifies the JWT against
        # the project's signing keys.
        response = supabase.auth.get_claims(token)
        claims = response.get(
            "claims"
        )

        if not claims:

            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

        return claims

    except HTTPException:

        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized",
        )
