# A (mostly) complete Sveltekit template! Version 2!

This blog was created using the Sveltekit framework. In addition, it uses Prisma for database connectivity, custom (and quite basic) authentication using bcrypt and session cookies, Twilio SendGrid for email functionality, Cloudinary as an image CDN, and Google reCAPTCHA for basic protection and validation.

This project was a lot of fun. I hope others can use it as a decent reference, whether it's a pointer in the right direction, or a prime example of "what not to do". Enjoy!

## NEW!

Added Google reCaptcha to login, password reset, and contact pages for some basic bot protection. Added an Image CDN service (Currently set up for Cloudinary, but attempted to keep it generalized enough to switch to something else) to serve blog and post images.

## NEW!

Side note, in case anybody is just starting out in Sveltekit, or just has unfamiliarity with npm as I do, npm run dev and npm run build -> npm run preview do NOT function the same way. The version 1 of this blog was naively tested in only npm run dev, which allows you to dynamically read from the src/lib folder, whereas the production version of a Sveltekit website will generate its own folder that will serve photos that are in the /static folder. However, writing to the /static or even the generated folder path corresponding to static does _not_ change the fact that Sveltekit cannot read them.

This is why the image CDN was added. One last thing, I'm a sucker for redundancy, so I still have it configured that when you upload a blog/post photo, it will still write it to the /static folder, while also uploading it to the CDN of your choice. This does two things. First, like I said, it adds redundancy to the photos. Second, if you say, create 3 blogs and 6 posts between them, and then make an enhancement and rebuild your project, those photos will get put into the generated .svelte-kit folder. I have logic implemented that _will prioritize serving photos locally rather than through the CDN, which should be more efficient, though I could be wrong. Feel free to change it._

The template is a heavily modified version of Start Bootstrap's "Clean Blog" template.

I will be the first to admit this probably does not adhere to many standards that are typically followed for Sveltekit projects, and may also not utilize the power of Sveltekit as much as it could. This is my first major JS/TS project, while additionally also being my first Sveltekit project. If there are any improvements, feel free to make some!

## NEW!

While there are still potentially _many_ things that are not standardized, I did some basic formatting standardization, as well as a relatively chunky code refactor to encourage better code reuse when possible. Also added a lot more comments to explain some reasoning, confusion, and other general thoughts.

If you decide to use this template for a blog, there are some TODOs:

# Before we begin, a quick rundown

The CSS is truthfully a gross timebomb. I import MDB, a material bootstrap theme, and the styles.css is what initially came with the Clean Blog template. This ultimately led to a _lot_ of !important's getting shoved into the custom.css I made. I'm bad at CSS, and from the bottom of my heart, I'm sorry.

Was worth it tho.

The authentication for this application was mostly built with the thought of only having an ADMIN user in mind, though it _can_ support multiple users.

There will be more information in the TODO list, but when the application starts and is first navigated to, it will check the database for any existing users. If a user does not exist, then the application will send an email to a specified "secret" email of your choosing with a custom slug tied to that specific email address. Following this link will allow you to create an account, and if the email provided in the registration process is the same as the specific "secret" email, then that account will be deemed an admin, and you will be able to create and edit blog posts.

Because I built this with only having the single admin user in place, I did not attach any links to the /login page, as creating and having a non-admin account was not an intended initial feature for this blog. But like I stated, it can support multiple users, as slugs are randomly generated for emails, duplicate account validation is in place, and the USER role exists. I did not want to implement multiple accounts for my blog, so that will be up to you to implement should you so choose.

Lastly, there is a password reset function, with the path of /reset. It will similarly generate a random slug and email a link to the email provided.

# TODO list to create your blog

I did my best to make everything configurable through environment variables, however because this blog does use a fair amount of third party services, there is some setup that must take place outside of the dev environment to spin it up correctly.

1. Create a favicon and replace it in the static folder.

2. Replace the placeholder photos in the assets folder, I recommend making the file names of the replacement photos the same though, to avoid issues.

3. Search for the TODO's, and fill them out (about page, description, etc)

4. Configure Twilio Sendgrid, here's a get started page: https://docs.sendgrid.com/for-developers/sending-email/api-getting-started. All you _really_ need is the API key, and in your Sendgrid account, be sure to configure an email address that will function as the SITE email address. E.g. the "sending" email.

5. Create a Cloudinary account, here's a get started page: https://cloudinary.com/documentation/how_to_integrate_cloudinary. After you create your Cloudinary account, in the home page you'll see they generate a cloudinary.config description. This description can be seen in the lib/Services/CDNService.ts, however it uses environment variables. Attach the corresponding environment variables to the .env variables listed at the end of this list.

6. Create a reCAPTCHA project here: https://www.google.com/recaptcha/admin/create. After creation, you will be served a public and private key. Attach these to the corresponding .env variables listed below.

7. Personally, I used PostGreSQL as my database system. This should be compatible
   with any database system that Prisma supports. Fill out the database URL from the next
   step, and ensure in the schema.prisma file, you use the correct provider.
   Ensure you generate the types and migrate the database! npx prisma generate, npx prisma migrate dev.

8. Create a top-level .env file. The file uses these private environment variables exactly, ensure the names of the environment variables match these to avoid issues. The environment variables are listed below.

Here is what my .env looks like, obviously without the values attached to them.

#Private

DATABASE_PRISMA_URL=
<br>
DATABASE_URL_NON_POOLING= SAME AS PRISMA_URL
<br>
DEV_URL=
<br>
PROD_URL=
<br>
EMAIL=
<br>
TWILIO_KEY=
<br>
ENV= (MOSTLY JUST CHECKS IF 'DEV')
<br>
SITE=
<br>
CLOUDINARY_CLOUD_NAME=
<br>
CLOUDINARY_API_KEY=
<br>
CLOUDINARY_API_SECRET=
<br>
PRIVATE_GOOGLE_SECRET_KEY=

#Public

PUBLIC_GOOGLE_SITE_KEY=
