#  Fincra Customer API

## NodeJS|Express|MongoDB|Redis

## Getting Started

### Clone and Install

```sh
# Clone this repo to your local machine
# Get into the directory
# Copy .env.example and create your own .env file
# Edit .env file and add your mongodb credentials and other credentials

# Install dependencies
npm install
```


# Fincra Customer Support Ticketing System

## A nodejs api for a customer support ticketing system


## Table of Contents

- [Prerequisites](#prerequisites)
- [Database](#database)
- [Assumptions](#assumptions)
- [Requirements](#requirements)
- [Setup](#setup)
- [Issues](#issues)
- [Feedback](#feedback)

## Prerequisites

Before getting started, make sure you have the following prerequisites installed and configured:

- Redis: This can be installed locally on you environment or you can run the docker-compose file in the root directory to install and start the redis server.
- Node Js: I am using Version 14.16.1. The Project should work with any version of nodejs above 12.0.0
- MongoDB: This can be installed locally on you environment or you can use the cloud version(mongodb Atlas)

## Database

the database used for this project is mongodb. The database is initialized once the project is started. Provide the `DATABASE_URL` in the .env file to connect to your mongodb database. The database is seeded with some data when the seed screipt is ran. The data is in the "src/database/static-data" folder . The data is seeded using the seed.ts file in the same folder.

## Assumptions

In developing this project, the following assumptions have been made:

1. Support ticket System for a Financial Organization
2. Admins and Support Agents can act on ticket requests, with admins having more privileges than support agents.
3. Admins can create support agents and other admins.

## Requirements Not cpvered

The following requirements have not been covered in this submission:

- Automatic assignment of SLAs and priorities to tickets
- Integration tests
- Kafka integration -> To be added in the future

## Setup

To configure and prepare the source code for building and running the project, follow these instructions:

1. Clone Project
    `git clone https://github.com/Tunechi28/Customer-Support-System.git`
2. Change to Project directory
     `cd Customer-Support-System`
3. Install dependencies
     `npm install`
4. Create a .env file in the root directory of the project and copy the contents of the .env.example file into it
     `cp .env.example .env`
5. Edit the .env file and add your mongodb credentials and other credentials
6. Seed Static Data 
     `npm run seed`
7. Run application Locally 
      `npm run dev`
8. To build the project, run 
      `npm run build`
9. click [here](https://documenter.getpostman.com/view/11574904/2s93sf2Wbb) to view project documentation`

## Issues

During the completion of this assignment, the following issues were encountered:

1. Time constraint
2. Not enough test coverage due to time constraint

## Feedback

Here are some constructive feedback points for improving the assignment:

1. Honest instructions on what to build as the project can grow to be very large



