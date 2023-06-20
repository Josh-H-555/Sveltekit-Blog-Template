# A (mostly) complete Sveltekit template!

This blog was created using the Sveltekit framework. In addition, it uses Prisma for database connectivity, custom (and quite basic) authentication using bcrypt and session cookies, and Twilio SendGrid for email functionality.

The template is a heavily modified version of Start Bootstrap's "Clean Blog" template.

I will be the first to admit this probably does not adhere to many standards that are typically followed for Sveltekit projects, and may also not utilize the power of Sveltekit as much as it could. This is my first major JS/TS project, while additionally also being my first Sveltekit project. If there are any improvements, feel free to make some!

If you decide to use this template for a blog, there are some TODOs:

# Before we begin, a quick rundown

The authentication for this application was mostly built with the thought of only having an ADMIN user in mind, though it _can_ support multiple users.

There will be more information in the TODO list, but when the application starts and is first navigated to, it will check the database for any existing users. If a user does not exist, then the application will send an email to a specified "secret" email of your choosing with a custom slug tied to that specific email address. Following this link will allow you to create an account, and if the email provided in the registration process is the same as the specific "secret" email, then that account will be deemed an admin, and you will be able to create and edit blog posts.

Because I built this with only having the single admin user in place, I did not attach any links to the /login page, as creating and having a non-admin account was not an intended initial feature for this blog. But like I stated, it can support multiple users, as slugs are randomly generated for emails, duplicate account validation is in place, and the USER role exists. I did not want to implement multiple accounts for my blog, so that will be up to you to implement should you so choose.

Lastly, there is a password reset function, with the path of /reset. It will similarly generate a random slug and email a link to the email provided.

# TODO list to create your blog

1. Create a favicon and replace it in the static folder.

2. Replace the placeholder photos in the assets folder, I recommend making the file names of the replacement photos the same though, to avoid issues.

3. Fill out your "about" page.

4. Create a Twilio SendGrid account, retrieve the API key.

5. Create a site email to that will be the sending email address when using the SendGrid API.

6. Fill out the links to socials in the Footer component.

7. Fill out description, author, and title in the app.html page.

8. Personally, I used PostGreSQL as my database system. This should be compatible
   with any database system that Prisma supports. Fill out the database URL from the next
   step, and ensure in the schema.prisma file, you use the correct provider.
   Ensure you migrate the database!

9. Create a top-level .env file. The file uses these private environment variables exactly, ensure the names of the environment variables match these to avoid issues. The environment variables are listed below.

DATABASEURL=YOURCONNECTIONSTRING

DEVURL=http://localhost:5173/

EMAIL=YOURSECRETADMINEMAILHERE

TWILIOKEY=YOURTWILIOAPIKEYHERE

ENV=DEV

SITE=YOURSITEEMAILHERE
