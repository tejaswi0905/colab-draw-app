Now here lets learn about how to create a new package.
"workspace:\*" means all the folders and files in this folder.

Step1 -> Create a folder in ./pachages eg: backend-common
step2 -> Navigate to that folder, and then run npm init -y. This will give us the package.json file
step3 -> create a tsconfig.json file
step4 -> Change the "name" inside the package.json file, for ex, change the name from "backend-common" to "@repo/backend-common" (Very important)

Now after the fist 4 steps we have the initial setup. Now the main advanced steps.

The tsconfig.json file should expted the @repo/typescript-config/base.json
go to ./packages/backend-common/tsconfig.json you will see this:
{
"extends": "@repo/typescript-config/base.json"
}

Then we need to add @repo/typescript-config as a dev dependency and then the value should be "workspace:\_"
go to ./pachages/backend-common/packge.json file and you will see this
"devDependencies": {
"@repo/typescript-config": "workspace:\*"
},

The we have to add the code that we want to export in package.json file, The name of the export and the file path of the exprot, in the backend-common package, we are exporting the code in src/index.ts file, so if we navigate to the ./pachages/backend-common/packge.json you get to see the following:
eg:
"exports": {
"./config": "./src/index.ts"
},
Here the .ts file extension if veryimportant, ./src/index.ts is super important.

Final step, we have to go to the app we weant and then add the @repo/backend-common as a dev dependency
eg: if you navigage to apps/ws-backend we get to see "@repo/backend-common": "workspace:\*", in devdependecies
Then we can import everything in the package into the app.
eg:
import {JWT_SECRET} from @repo/backend-common/config, remember we are exporting the index.ts file as config in the package.json of backend-common.

go to the root folder and run pnpm install to resolve everything.

---

In the very start we did the same/similar thing with the packages/typescript-config
step 1 --> we created a tsconfig.json file in the app that we want, take ws-backend as an example
Then put this in that file
{
"extends": "@repo/typescript-config/base.json",
"compilerOptions": {
"rootDir": "./src",
"outDir": "./dist"
}
}
Then add this inside the devdependencies, "@repo/typescript-config": "workspace:\*",
go to the root folder and run the pnpm install to resolve everything.
