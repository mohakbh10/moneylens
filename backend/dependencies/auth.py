from fastapi import (
    Header,
    HTTPException,
)

from services.supabase_service import supabase


def get_current_user(
    authorization: str | None = Header(default=None)
):
    # Authorization header must look like:
    # Bearer <access_token>

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid authorization header",
        )

    token = authorization.removeprefix(
        "Bearer "
    ).strip()

    try:

        # Supabase verifies the JWT against
        # the project's signing keys.
        response = (
            supabase.auth.get_claims(
                token
            )
        )

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