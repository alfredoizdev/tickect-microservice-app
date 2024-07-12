# Ticket App

This is a microservice application built with Node.js, Next.js, and Kubernetes.

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js
- Docker
- Kubernetes

## Getting Started

1. Clone this repository:

   ```shell
   git clone https://github.com/your-username/ticket-app.git
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

3. Build the application:

   ```shell
   npm run build
   ```

4. Start the application:

   ```shell
   npm start
   ```

## Deployment

To deploy the application to Kubernetes, follow these steps:

1. Build the Docker image:

   ```shell
   docker build -t ticket-app .
   ```

2. Push the Docker image to a container registry:

   ```shell
   docker push your-registry/ticket-app
   ```

3. Deploy the application to Kubernetes:

   ```shell
   kubectl apply -f kubernetes/deployment.yaml
   ```

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md) when making changes to this project.

## License

This project is licensed under the [MIT License](LICENSE).
