# SaaS on AWS with New Relic Integration
## SaaS Identity and Isolation with Amazon Cognito on the AWS Cloud featuring New Relic Management and Monitoring
## saas-identity-cognito-newrelic

**This is a new New Relic Integrated version of the SaaS Identity and Isolation with Amazon Cognito Quick Start.**

This Quick Start contains a revision of code, and CloudFormation templates to provide integration to the New Relic platform to provide an example of how a multi-tenant provider can integrate management and monitoring from New Relic into a Software as a Service (SaaS) Application. 

This Quick Start provides monitoring for a multi-tenant environment by using New Relic APM, and Insights to demonstrate how an Independent Software Vendor (ISV) can integrate management and monitoring within a Software as a Service (SaaS), on top of AWS.

**There are two options to deploy this Quick Start with New Relic.**

    Option 1 - Simple Deployment: 
    Deploy using the CloudFormation Template hosted in the S3 Bucket within the New Relic AWS Account.

    Option 2 - Custom Deployment: 
    Deploy using the CloudFormation Template hosted within an S3 Bucket in your AWS account.


# Option 1 - Deploy Using CloudFormation Template in New Relic S3 Bucket.

1. Complete Steps included included within "Instructions"

          Note: Use Templates provided below for Option 1.
          A) Template to Create Quick Start with a New VPC: 
          https://s3.amazonaws.com/saas-identity-cognito-newrelic/1/templates/saas-identity-cognito-master.template
          B) Template to Create Quick Start with an Existing VPC:
          https://s3.amazonaws.com/saas-identity-cognito-newrelic/1/templates/saas-identity-cognito.template

# Option 2 - Deploy Using CloudFormation Template in S3 Bucket in your AWS Account.

1. Complete Steps included within "Prerequisites" 
2. Complete Steps included included within "Instructions"

# Prerequisites
1. GIT Clone the Repository

          A) git clone {git clone url}
          
2. GIT pull on repository to update VPC Templates in submodule.
   If this doesnt work do:

          A) rmdir submodules/quickstart-aws-vpc
          B) git rm --cached submodules/quickstart-aws-vpc
          C) git submodule add https://github.com/aws-quickstart/quickstart-aws-vpc.git /submodules/quickstart-aws-vpc

3. Create an S3 Bucket
4. Create a folder in the S3 Bucket labeled ‘1’
5. Edit the master and workload CloudFormation Templates to correspond to the new S3 bucket name.
    
          Ex: Default: saas-identity-cognito-newrelic -> Default: newbucketname)
          
6. Upload entire Repository to the folder in the S3 bucket labeled '1'
7. Copy the Master template URL
8. Open CloudFormation Console
9. Create the Stack using Master Template URL for S3
10. Following Instructions on Github for Stack creation

# Instructions
1. Create a New Relic Account. 

          NOTE: The New Relic account must have the following services at a minimum for this Quick Start to work: 
          A) New Relic Browser Pro + SPA
          B) New Relic APM
          NOTE: Additionaly, for the Walkthrough to work it is expected that the user has access to:
          A) New Relic Insights
          B) New Relic Synthetics
2. Create an AWS Account.

          NOTE: Need Systems Administrator Role in AWS for Stack Creation to Succeed as expected.
3. Create a Browser Application in New Relic (Navigate to New Relic Browser)
          
          A) Click Add More
     ![Add a Browser Application](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Add%20Browser%20Application.png)

          B) Select "Copy/Paste Javascript code" Option
     ![Browser Application Created](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/blob/master/images/Browser%20Application%20Created.png)

          C) Select "Pro + SPA"
          D) Name Client Application. (Ex: SaaS-Demo)
     ![Browser Client Setup](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/blob/master/images/Add%20SaaS-Demo%20Client%20Application%20to%20New%20Relic%20Browser.png)

          E) Click "Enable"
          F) Copy JavaScript into Text Editor
          G) Copy Beacon specific code 
     ![Beacon for New Relic](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Beacon%20for%20CloudFormation.png)

          Ex:  {beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"1234",applicationID:"5678",sa:1}

4. Obtain New Relic License Key (Navigate to New Relic APM_

          A) Click New Relic APM
     ![Click New Relic APM](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/APM%20Dashboard.png)
          
          B) Click Node Image
     ![Click Node](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Node%20APM%20Dashboard.png)
          
          C) Click Reveal License Key
     ![Reveal License Key](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Reveal%20License%20Key.png)
          
          D) Copy License Key Down in Text Editor

5. Login to AWS Console
     ![Login to AWS](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Login-to-AWS.png)

6. Navigate to CloudFormation Service
  ![CloudFormation](https://github.com/judahb/saas-identity-cognito-newrelic/blob/master/images/CloudFormation%20Console.png?raw=true)

7. Click Create Stack
  ![CloudFormation](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Create%20a%20Stack.png)

8. Paste in the corresponding S3 Template URL.
  ![S3 Template](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Select%20an%20S3%20URL.png)

         A) For Quick Start with New VPC Use Link Below
         https://github.com/judahb/saas-identity-cognito-newrelic/blob/master/templates/saas-identity-cognito-master.template
         B) For Quick Start with Existing VPC Use Link Below
         https://github.com/judahb/saas-identity-cognito-newrelic/blob/master/templates/saas-identity-cognito.template

9. Enter Parameters for Quick Start

         A) Enter Beacon Javascript as the Parameter: NewRelicRumBeacon
         B) Enter New Relic License Key as the Parameter: NewRelicLicenseKey
  ![CloudFormation Parameters](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Enter%20Required%20Quick%20Start%20Parameter.png)
         
10. Click Next on Stack Creation
11. Add Tags if required
12. Accept by click the check-box for the message "I acknowledge that AWS CloudFormation might create IAM resources with custom names."
  ![IAM Resources](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Accept%20IAM%20Response.png)
  
13. Click "Create"

         A) Wait Approximately 40 Minutes for the Stack to Create
14. Navigate to the Stack Output of the first CloudFormation Stack, with the name you entered.
15. View the outputs of the Stack
     ![View Stack Outputs](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/View%20Stack%20Outputs.png)
     
16. Copy the URL of the Outputs Stack for the "Website" in a Web Browser and navigate to this Web Page
17. Navigate to the Email Client for the Email Address Entered on Stack Creation, and obtain the username and password.
18. Login to the Website provided in the Outputs using the corresponding Email Address/Username and Password.
     ![Login to Website](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Login.png)

19. This is the view of the Independent Software Vendor, and is the Systems Administrator.
20. Navigate Freely through the functionality of the System
21. Log out as the Systems Administrator
22. Create "X" number of Tenants by clicking the "Register" button.
     ![Register Tenant](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Register.png)

23. An email will be recieved and a new Tenant will be created. 

          NOTE: A Unique email is required
24. Login to the system using the newly provided username and password
     ![Login to Website](https://raw.githubusercontent.com/judahb/saas-identity-cognito-newrelic/master/images/Login.png)
     
25. This is the view of a Tenant within the Software as a Service (SaaS) provided by the ISV.
26. Navigate the system as X number of tenants freely by adding unlimited number of Users, Products, and Orders within the Tenant.
27. Log out of the Application, after creating products, orders, and users with a minimum of Two Tenants.
28. Sign into the New Relic Control Panel
29. Navigate to the corresponding New Relic Service including APM, Insights, or Browser to see the data added. (For additional details on how to create and navigate dashboards in New Relic, a blog post will be published by Amazon Web Services and New Relic.


## -------------------------------------------------------------------------
## Steps Listed Below are from the SaaS Identity and Isolation with Amazon Cognito on the AWS Cloud Quick Start 
#### These can be referenced from the source Github Repostiory located @ https://github.com/aws-quickstart/saas-identity-cognito
## -------------------------------------------------------------------------
# saas-identity-cognito
## SaaS Identity and Isolation with Amazon Cognito on the AWS Cloud


This Quick Start implements a high availability solution for identity and isolation in multi-tenant software as a service (SaaS) environments, using Amazon Cognito as the identity provider.

The Quick Start sets up the AWS environment and provides a lightweight SaaS order management system that illustrates different aspects of identity and isolation, spanning the roles in a multi-tenant environment. The Quick Start deployment includes AWS services such as Amazon Cognito, AWS Lambda, Amazon API Gateway, and Amazon EC2 Container Service (Amazon ECS).

This Quick Start deploys the SaaS architecture into a virtual private cloud (VPC) that spans two Availability Zones in your AWS account. The deployment and configuration tasks are automated by AWS CloudFormation templates that you can customize during launch. The deployment guide explains core SaaS identity and isolation concepts and implementation details, and includes a walkthrough.

The Quick Start offers two deployment options:

- Deploying the SaaS environment into a new virtual private cloud (VPC) on AWS
- Deploying the SaaS environment into an existing VPC on AWS

You can also use the AWS CloudFormation templates as a starting point for your own implementation.

![Quick Start architecture for SaaS identity and isolation on AWS](https://d0.awsstatic.com/partner-network/QuickStart/saas/saas-identity-with-cognito-architecture-on-aws.png)

For architectural details, best practices, step-by-step instructions, and customization options, see the [deployment guide](https://s3.amazonaws.com/quickstart-reference/saas/identity/cognito/latest/doc/saas-identity-and-isolation-with-cognito-on-the-aws-cloud.pdf).

To post feedback, submit feature ideas, or report bugs, use the **Issues** section of this GitHub repo.
If you'd like to submit code for this Quick Start, please review the [AWS Quick Start Contributor's Kit](https://aws-quickstart.github.io/). 
