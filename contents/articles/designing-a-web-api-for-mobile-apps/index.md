---
title: Designing a Web API for Mobile Apps
author: Simon Guest
date: Fri, 05 Jul 2013 17:14:04 GMT
template: article.jade
---

As you can imagine, over the past few years, we've seen a fair share of good and bad API design.  In this blog post, I wanted to share some of my observations, thoughts, and questions that I ask of a well designed Web API, especially one that will be called from a mobile app.

<span class="more"></span>

**1. Are the basics being met?**

First, the basics.  Without question, every Web API should be stateless.  There should be no session state, cookies, or server-side values used to hold any state of any kind.  Adding state adds complexity, and limits the ability for the API to scale, which for a mobile application that could reach millions of users is something that we want to avoid.

Also, endpoints of the API should be exposed through SSL by default.  SSL is easy to setup, performant, and should be enabled for any API that we either consume or create.  As you may have observed, using SSL as default seems to be a direction in which many other APIs are heading.

**2. How do we authenticate with the API?**

Authentication is critical to a Web API, and (in my opinion) is one of the common pitfalls.  As a rule, user credentials should never be passed as part an API call.  Take the following example:

```
GET /accounts?username=simon&password=simon
```

Doing this is bad for three reasons:

Firstly, although the URL gets encapsulated as part of the HTTPS session, it is likely still visible in any logs on the Web server.  This often also applies to user credentials passed as HTTP headers.

Secondly, it makes debugging with users and other developers awkward (because you often need to ask for their username and password).  This is especially bad if the credentials are corporate accounts used for other systems.

Finally, and most importantly, these types of credentials typically have a long shelf life.  If the call is ever compromised, there's a good chance that it can be replayed back to the service up until the password is changed, which could be many months (if ever at all).

To overcome this, some APIs use an application key or some other token derived from a HMAC algorithm.  This may work for some scenarios, but unfortunately if the key is exposed, it can be difficult to revoke.  This is especially true if the key has been embedded in a mobile app running on thousands of devices.

Fortunately, to overcome both of these issues, there is OAuth 2.0\.  OAuth 2.0 works by having the user pass a set of credentials (typically a username and password) to an authentication service.  Assuming the credentials are valid, the user/application/consumer receives back an access token.  This access token is then passed as a HTTP Authorization Header to the Web API to verify the authenticity of the request.  Moreover, this access token has an expiry (I find an hour to be a good time frame) so that if someone were to get hold of the token, their usage of the API is limited to this timeframe.  (You can read up much more about OAuth 2.0 [here](http://oauth.net/2/))

There's no doubt that implementing OAuth 2.0 involves more work, including setting up an authentication API and handing the lifetime of the token, but the end result is an API that is more secure and will also reflect the security model used by many others (e.g. Facebook, Google) - which means that you can even use these third parties as identity providers if you so choose.

**3. Is the API really using REST?**

I've seen many examples of people thinking that they have a REST API when really they don't.  Correct use of REST is about nouns, not verbs.  Let's take this URL for example:

```
GET /GetAccountBalance?account_id=1234
```

Although the above URL is accessed over HTTP, it's really not a REST API.

Using REST to it's true intention means combining HTTP VERBS together with nouns or entities in the URL that represent the data you are exposing.  Instead of the previous URL, a correct REST syntax would be the following:

```
GET /accounts/1234
```

To create a new account we would use a HTTP PUT (together with a payload with the new account information)

```
PUT /accounts
```

To delete an account, we would use:

```
DELETE /accounts/1234
```

This noun-based approach can also work with hierarchical data.  For example:

```
GET /accounts/1234/transactions/50
```

Will return the a transaction (with id of 50) for Account 1234.

Overall, a good understanding of REST, together with a focus on exposing nouns instead of functional methods will go a long way to create a more more usable and accepted API.

**4. How should we consume this API?**

If you are dealing with an API that exposes a lot of entities, in addition to exposing generic REST endpoints, there are typically six things also worth considering:  Sorting, Searching, Filtering, Pagination, Helpers, and Partial Responses.

Sorting.  Should the API return a sorted list of data to the consumer/application?  If so, a sort parameter on the noun can be useful:

```
GET /accounts?sort=id
```

```
GET /accounts?sort=-id
```

As shown above, a leading hyphen to indicate ascending or descending sort order can be a great timesaver (and often negates another query string parameter for sort order).

Searching.  Similar to sorting, providing a way for consumers to search entities can be useful.  The use of the "q" parameter for search is somewhat standard:

```
GET /api/accounts?q=acme
```

Filtering.  Another useful pivot for any REST based API is the ability to filter on a particular noun.

```
GET /accounts?filter=balance%3E500
```

(You can choose to use the URL encoded character for > as shown above, or I've seen many other APIs use gt, lt query parameters).

Pagination.  A type of filtering, especially useful for large datasets.

```
GET /accounts?limit=50&offset=25
```

This above call will get the next 50 accounts, starting at the 25th entry.

Helpers.  With many APIs there are a number of common requests.  Maybe it's the list of top ten customers, or the best sales people of the month. Putting these common requests as "helpers" into the API can be very useful for consumers, and can also help reduce the "chattiness" of the API by reducing the number of repeat requests.

```
GET /accounts/top-ten
```

Partial responses.  Finally, many consumers of the API (especially mobile applications) will want only a summary set of data.  This can be useful to build a list of items (in a master/detail view), without having to send the entire details for each item.

```
GET /accounts?fields=id,name,balance
```

Of course all of the above parameters can be combined as required.

```
GET /accounts?fields=id,name&sort=id&limit=100&offset=50
```

**5. What will the API return?**

For the majority of APIs, especially those that will be consumed from a mobile application over a potentially slow connection, returning JSON is always good practice.  Compared to XML, data returned in JSON format will likely be more lightweight, and will require less parsing and processor overhead on the device.

With that said, there are cases where other formats might be required - for example, a legacy system that is already expecting data in XML.  In which case, you might want to consider allowing the consumer to specify what type of data to return either through the HTTP Accept header or through a URL action (useful if you anticipate doing a lot of debugging).

```
GET /accounts?format=xml
```

There has also been a lot of talk recently about HATEOAS (Hypermedia As The Engine Of Application State), a term coined by Roy Fielding.  While there are many articles and presentations that explain Roy's initial intentions, for the purpose of this blog post (and my own sanity), HATEOAS in a Web API referring to the use of links that instruct the consumer where to go for related information.

For example, let's imagine we made the following API call:

```
GET /accounts/1234
```

We might receive the following response:

```
{ "account_id" : "1234", "balance" : "100.90" }
```

With a "HATEOAS-compliant" Web API, we may also receive embedded links.  For example:

```json
{ "account_id" : "1234", "balance" : "100.90",
  { "_links" :
    { "transactions" : { "href" : "/accounts/1234/transactions" } }
  } 
}
```

As you can see above, the API returns the data for the account, but also returns a link to the API call that will return all of the transactions for that account.  Think of these links as helping the consumer navigate to other related API calls.  (Incidentally there are a number of JSON formats for doing this, although I would recommend [JSON HAL](http://stateless.co/hal_specification.html)

**6. Are the methods of the API consistent? **

While it's difficult to recommend what you should name your methods and other parts of your API, the key to success is often consistency.  For example, if you have the endpoints for your accounts here:

```
GET /accounts
```

For your invoices, it would be silly to have them here:

```
GET /order_entry/ledger/invoices_full
```

In an ideal world (and even one without HATEOAS!), a user should be able to guess what the API should be based on previous usage.  Keeping the paths and names consistent are key to making this happen.

Related to this, choosing the right case for APIs can be very important.  Having these two apis:

```
GET /accounts
```

```
GET /Invoices
```

will likely lead to issues because of the case mismatch on the entity name.  My recommendation is to use lowercase throughout (then there is no ambiguity) and to use snake case to conjoin words.  For example:

```
GET /customer_details
```

Spinal case (using hyphens) is also acceptable, but if you are doing a lot of descending sorting, you may want to be careful.

Finally, in terms of consistency, it's always nice to be consistent with pluralization:

```
GET /accounts/1234/invoice
```

Assuming there are more than one invoice per account, this could also run people into trouble.  I would recommend deferring everything to plural to ensure consistency.

```
GET /accounts/1234/invoices
```

**7. How is the API versioned?**

Versioning is important, especially if there are breaking changes in production environments.  There are a couple of ways to achieve this:

For large volume APIs where version consistency is critical, I would recommend placing the version information as part of the API call.

```
GET /v1.0.0/accounts
```

Versioning by using the URL makes it very explicit as to the version that the consumer is using.

For less critical systems, or for APIs where breaking changes are going to be rare, I would recommend that consumers pass an optional version number as part of the HTTP header.  If the version number is passed as part of the post, the consumer gets a specific versioned response, otherwise they'll be receiving the latest version.

In addition to version numbers, I always like to see specific environments affiliated with the URL.  This is most easily done as part of the host subdomain, as it will likely correspond with the physical or virtual machine that the API is hosted from:

```
GET https://dev.example.org/accounts
```

```
GET https://uat.example.org/accounts
```

```
GET https://prod.example.org/accounts
```

The above makes it very clear whether I'm hitting the development, UAT, or production version of the APIs when I make my calls.

**8. How is the API documented?**

If you have a well designed API, you do not need to spend hours of time documenting the API in a Word document.  If anything you are going to end up with a Word document that will become quickly out of date.  In terms of documentation, there are two things that I find invaluable:

Firstly, mandatory and optional methods and parameters should be documented.  It's important that consumers understand what they can and cannot pass to the API.  What's nice is that this documentation can typically be auto generated from the method signatures or comment blocks (which will keep your documentation in sync with your code).

Secondly, sample code to show how to call the API.  A few sample calls for each method can be a life saver and much more valuable than reams of documents.  In these samples, show how the request should be formatted and what the response looks like.

**9. What does the API return when things go wrong?**

Returning useful error messages to consumers of your API is really important.  You should think about two types of error messages - ones that can be expressed with HTTP result codes, and ones that cannot.

For the ones that can be expressed through a result code, simply return the result code with an optional body of information (in JSON format).  For example, if the access token has expired, return a 401 HTTP error code, and maybe some JSON payload to help debugging.  Also, if any part of the system is down (e.g. the database connection can't be established), I would recommend returning a 500 for clarity.  With any HTTP result code, remember to pass the right one.  A good rule of thumb is that result codes in the 400's typically indicate an error with the client, whereas codes in the 500's means that something has gone wrong on the server.

For errors that can't be expressed through a HTTP result code, you should be returning a JSON payload that contains a minimum of two pieces of data - a unique error code for the issue, and a message aimed for the consumer/developer of the application to help them debug.  For example, if the consumer tried to create a new account without including all of the mandatory fields, this would be a useful error to return:

```
{ "error" : 16, "debug" : "The mandatory field for balance was missing in the request" }
```

Some recommend returning a user message also, which can be useful.  Others use the error code to create their own message to pass to the user.

**10. Finally, what else should we be thinking about for using the API in production?**

There are many considerations for using APIs in production - here are just a few:

How are you going to make money from your API?  Are you thinking about a transaction cost per call, freemium, capped model, or something else?  Many of these systems are going to require some kind of API metering - which isn't necessarily hard, but is definitely something else to consider.

Are you going to rate limit your API?  How are you going to prevent a rogue customer, application, or process, who wishes to call your API hundreds of thousands of times?  Fortunately, there are answers to this - including RFC6585 which specifically deals with rate limiting - but again, something that you should be considering.

Should your API provide cached results? Is this something that can improve the performance for your consumers, and also prevent unnecessary calls to back end databases and other systems?

How is your API going to work over a low bandwidth connection?  Your API might work great on your FIOS line here in the US, but do consumers get the same experience when calling the API from a J2ME application from a cell phone in the middle of Africa?  There are many ways to simulate throttled connections and this should be something that is definitely worth testing for.

Finally, and arguably most importantly, how can you get everything to go through your API?  Instead of thinking of an API as a companion to your existing Web-based applications, what would it take to push everything through this API - treating the API as a single source of truth?  It might sound scary, and undoubtedly it's additional work to have everything using the API - but a single API that every application uses has the potential to offer a lot of re-use and sharing as you develop your API over time.
