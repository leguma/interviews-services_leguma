# Hinge Health Services Code Challenge

## Welcome. Thank you for taking the time to collaborate with us today.

Today we’d like you to build a service that manages and manipulates trees. Our goal with this activity isn't to "stump" anyone with tricky business but to give candidates a fair and uniform way to express themselves in code on a realistic-ish problem.
 
This activity is purposely limited in scope to be respectful of your time while still enabling you to demonstrate how you approach and solve problems. If invited to an on-site interview, you'll pair with us to extend the service you created. We'd much rather see how you work on a problem you're familiar with than on some clever whiteboard puzzle we spring on you.

At this stage, we care most about:
- Interpreting written specifications (following instructions)
- Good design decisions.
- Ability to consider edge cases.
- Documentation
 

### What language do I code in?
Feel free to choose whichever language you are most comfortable in. We provided a few "hello world" services in directories named after the programming language of implementation. If picking a different language, create a directory with the name of the language, under which you should put your code.

For whatever language you choose, please document in a readme.md the following. 
1. How to set up your service
2. How to run your service
3. How to run the tests, if there are any
4. Document any other design choices you made along the way.

### How do I get started?
Clone this repo, create a branch, and work off of this new branch. Do not merge the code into main. Oh, and don't squash your commits. We'd like to see the milestones of your progress. 
 
When you're done, push your code to this repo and email us.

&nbsp;
## The Problem

A new frontend application is being built to spec by a team of coders out in deep space. Hence they are rarely available and unable to negotiate any changes to an API specified below. The application renders and stores a tree of data.

Animals, an example of a tree;

```
1: root
    2: ant
    3: bear
        4: cat
        5: dog
            6: elephant
    7: frog
```

The format is a simple unique numeric id and alphanumeric label eg, `id: label`. Indentation indicates a child relationship. So, `1: root` has the children `2: ant, 3: bear, 7: frog`.

&nbsp;
## API Details and Challenge Tasks

For the first two tasks, persisting data in memory or simple files is adequate.

The service should run on, `http://localhost:3001/api/<end-point>` and the following end points should be available.
<br><br>

---
<br>

### 1. `GET /api/tree` return the entire tree - in the following format;

```
[
    {
        "<id>": {
            "label": "<first item>",
            "children": [
                {
                    "<id>": {
                        "label": "<another item>",
                        "children": [] // empty children
                    }
                },
                {
                    "<id>": {
                        "label": "<another item>",
                        "children": [ ...<any children>... ]
                    }
                }
            ]
        }
    }
]
```

#### Task 1

Add the route and return the data structure that represents the animals example above.

*Note: This will be the first endpoint we test.*
<br><br>

---
<br>

### 2. `POST /api/tree/` with the payload of the format

```
{
    "parent": "<id>",
    "label": "<label>"
}
```

Will cause a node to be added to the end of a list of children, a new unique id should be assigned by the service. The response should be simple.

#### Task 2

Implement the route, and ensure that a `GET /api/tree` request returns the updated tree.
<br><br>

---

<br>

### 3. Data persistance

This part __does not__ have to be implemented in code. Document the queries, methods, and decisions you would make if implementing. 
<br><br>

#### Task 3

Design a data schema for a database of your choice that would support the tree data above. Add to a `database.md` file.
<br><br>
#### Task 4

Write sample queries / code that would support the two routes that are detailed above. Add to a `database.md` file.
