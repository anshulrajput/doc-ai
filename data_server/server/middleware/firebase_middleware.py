# firebase_middleware.py
import firebase_admin
from firebase_admin import auth
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

class FirebaseAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Get the token from the Authorization header
        auth_header = request.headers.get('access-token')

        print(auth_header)

        if auth_header:
            try:
                id_token = auth_header

                # Verify the token with Firebase Admin SDK
                decoded_token = auth.verify_id_token(id_token)

                # If token is valid, attach the user information to the request object
                # request.user = decoded_token

            except auth.InvalidIdTokenError:
                return JsonResponse({'error': 'Invalid ID token'}, status=401)
            except auth.ExpiredIdTokenError:
                return JsonResponse({'error': 'Token has expired'}, status=401)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=401)
        else:
            # If no Authorization header, return 401 Unauthorized
            return JsonResponse({'error': 'Authorization header is missing'}, status=401)
