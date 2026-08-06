
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
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    # Authorization header must look like:
    # Bearer <access_token>

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

    except Exception as error:

        print(
            "AUTH ERROR:",
            type(error).__name__,
            str(error),
        )

        raise HTTPException(
            status_code=401,
            detail="Unauthorized",
        )