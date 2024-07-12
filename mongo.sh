kubectl port-forward svc/auth-mongo-service 27017:27017 -n chat-app

echo "Mongo is now port forward anable."