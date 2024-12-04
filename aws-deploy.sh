#!/bin/bash

# Build the application
npm run build

# Install AWS CLI if not already installed
# aws --version || curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install

# Configure AWS credentials (should be done manually before running this script)
# aws configure

# Create S3 bucket (if it doesn't exist)
aws s3api create-bucket \
    --bucket your-app-bucket-name \
    --region your-region \
    --create-bucket-configuration LocationConstraint=your-region

# Enable static website hosting
aws s3 website s3://your-app-bucket-name/ \
    --index-document index.html \
    --error-document index.html

# Set bucket policy for public access
aws s3api put-bucket-policy \
    --bucket your-app-bucket-name \
    --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-app-bucket-name/*"
        }
    ]
}'

# Upload the built files to S3
aws s3 sync dist/ s3://your-app-bucket-name/ \
    --delete \
    --cache-control max-age=31536000,public

# Set proper cache control for index.html
aws s3 cp dist/index.html s3://your-app-bucket-name/index.html \
    --cache-control max-age=0,no-cache,no-store,must-revalidate \
    --content-type text/html \
    --metadata-directive REPLACE

echo "Deployment complete! Your app is available at:"
echo "http://your-app-bucket-name.s3-website-your-region.amazonaws.com"