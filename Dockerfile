# Step 1: Use an official lightweight Node.js runtime as a parent image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first to cache dependencies
COPY package*.json ./

# Step 4: Install all your dependencies
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Run your npm build step (Uncomment this if you are using TypeScript/Vite/Babel)
# RUN npm run build

# Step 7: Inform Docker that the container listens on port 10000
EXPOSE 10000

# Step 8: Define the command to run your app using npm
CMD [ "npm", "start" ]