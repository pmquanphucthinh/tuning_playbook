export default {
  "slug": "redis",
  "name": "Build your own Redis",
  "short_name": "Redis",
  "release_status": "live",
  "description_md": "In this challenge, you'll build a toy Redis clone\nthat's capable of handling basic commands like PING, GET\nand SET. Along the way, we'll learn about event loops, the Redis\nProtocol and more.\n",
  "short_description_md": "Learn about TCP servers, events loops, the Redis protocol and more\n",
  "completion_percentage": 30,
  "languages": [
    {
      "slug": "c",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-c"
    },
    {
      "slug": "clojure",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-clojure"
    },
    {
      "slug": "crystal",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-crystal"
    },
    {
      "slug": "csharp",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-csharp"
    },
    {
      "slug": "elixir",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-elixir"
    },
    {
      "slug": "go",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-go"
    },
    {
      "slug": "haskell",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-haskell"
    },
    {
      "slug": "java",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-java"
    },
    {
      "slug": "javascript",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-javascript"
    },
    {
      "slug": "php",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-php"
    },
    {
      "slug": "python",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-python"
    },
    {
      "slug": "ruby",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-ruby"
    },
    {
      "slug": "rust",
      "starter_repository_url": "https://github.com/codecrafters-io/redis-starter-rust"
    }
  ],
  "marketing": {
    "description": "Learn about TCP servers, event loops, the Redis protocol and more",
    "difficulty": "medium",
    "introduction_md": "In this challenge, you’ll build an application that can speak the Redis\nprotocol, and is capable of serving basic commands like PING, ECHO, SET and\nGET. Along the way, you’ll learn about TCP servers, event loops and more.\n",
    "sample_extension_idea_title": "Persistence",
    "sample_extension_idea_description": "A Redis server that can read and write .rdb files",
    "testimonials": [
      {
        "author_name": "Charles Guo",
        "author_description": "Software Engineer, Stripe",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/charles-guo.png",
        "link": "https://github.com/shaldengeki",
        "text": "The Redis challenge was extremely fun. I ended up having to read the\nRedis Protocol specification doc pretty carefully in its entirety! The result\nfelt like lightly-guided independent study, if that makes sense. (Which, again, was lots of fun)\n"
      },
      {
        "author_name": "Patrick Burris",
        "author_description": "Senior Software Developer, CenturyLink",
        "author_avatar": "https://codecrafters.io/images/external/testimonials/patrick-burris.jpeg",
        "link": "https://github.com/Jumballaya",
        "text": "I think the instant feedback right there in the git push is really cool.\nDidn't even know that was possible!\n"
      }
    ]
  },
  "stages": [
    {
      "slug": "init",
      "name": "Bind to a port",
      "description_md": "In this stage, your task is to start a TCP server on port 6379, the default port that redis uses.\n",
      "difficulty": "very_easy",
      "marketing_md": "In this stage, you'll start a TCP server on port 6379, which is the\ndefault port that Redis uses.\n",
      "source_walkthrough_slug": "redis-bind-port",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_bind.go#L11"
    },
    {
      "slug": "ping-pong",
      "name": "Respond to PING",
      "difficulty": "easy",
      "description_md": "In this stage, you'll respond to the\n[PING](https://redis.io/commands/ping) command.\n\nYour server should respond with `+PONG\\r\\n`, which is \"PONG\" encoded as a [RESP simple string](https://redis.io/docs/reference/protocol-spec/#resp-simple-strings).\n\nSince the tester client _only_ sends the PING command at the moment, it's okay to\nignore what the client sends and hardcode a response. We'll get to parsing\nclient input in later stages.\n",
      "marketing_md": "In this stage, you'll respond to the\n[PING](https://redis.io/commands/ping) command. You'll use [the Redis\nprotocol](https://redis.io/topics/protocol) to encode the reply.\n",
      "source_walkthrough_slug": "redis-ping-command",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_ping_pong.go#L9"
    },
    {
      "slug": "ping-pong-multiple",
      "name": "Respond to multiple PINGs",
      "difficulty": "easy",
      "description_md": "In this stage, you'll respond to multiple\n[PING](https://redis.io/commands/ping) commands sent by the same connection.\n\nTo test your implementation using the [official Redis CLI](https://redis.io/docs/ui/cli/), you can start your server using \n`./spawn_redis_server.sh` and then run `echo -e \"ping\\nping\" | redis-cli` from your terminal. This will send two PING commands\nusing the same connection. \n\n{{#lang_is_javascript}}\nIn most languages, you'd need to run a loop that reads input from a connection and sends a\nresponse back. In JavaScript however, if you're listening to the\n[`data`](https://nodejs.org/api/net.html#net_event_data) event, this should be automatically handled for you. **It\nis very likely that the code you had for the previous stage will pass this stage without any changes!**\n{{/lang_is_javascript}}\n\n{{^lang_is_javascript}}\nYou'll need to run a loop that reads input from a connection and sends a\nresponse back.\n{{/lang_is_javascript}}\n",
      "marketing_md": "In this stage, you'll respond to multiple\n[PING](https://redis.io/commands/ping) commands sent by the same client.\n",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_ping_pong.go#L35"
    },
    {
      "slug": "concurrent-clients",
      "name": "Handle concurrent clients",
      "difficulty": "medium",
      "description_md": "In this stage, your server will need to handle multiple concurrent\nclients. Just like the previous stages, all clients will only send `PING`\ncommands for now.\n\n{{#lang_is_javascript}}\nIn most languages, you'd need to either use threads or implement an\n[Event Loop](https://en.wikipedia.org/wiki/Event_loop) to do this. In JavaScript however, since [the concurrency\nmodel itself is based on an event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop), most\nstandard library functions are designed to support this kind of concurrent behaviour out of the box. **It is very\nlikely that the code you had for the previous stage will pass this stage without any changes!**\n{{/lang_is_javascript}}\n\n{{^lang_is_javascript}}\nTo achieve this, you'll need to either use threads, or, if you're feeling\nadventurous, an [Event Loop](https://en.wikipedia.org/wiki/Event_loop) (like\nthe official Redis implementation does).\n{{/lang_is_javascript}}\n",
      "marketing_md": "In this stage, you'll add support for multiple concurrent clients to your\nRedis server. To achieve this you'll use an [Event\nLoop](https://en.wikipedia.org/wiki/Event_loop),\nlike the official Redis implementation does.\n",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_ping_pong.go#L56"
    },
    {
      "slug": "echo",
      "name": "Implement the ECHO command",
      "difficulty": "medium",
      "description_md": "In this stage, you'll respond to the\n[ECHO](https://redis.io/commands/echo) command.\n\nThe client will send you the command as a RESP array, which looks\nsomething like this:\n\n```\n*2\\r\\n$4\\r\\nECHO\\r\\n$3\\r\\nhey\\r\\n\n```\n\nSeems confusing? Read up about [sending commands to a Redis\nserver](https://redis.io/docs/reference/protocol-spec/#send-commands-to-a-redis-server).\n",
      "marketing_md": "In this stage, you'll respond to the\n[ECHO](https://redis.io/commands/echo) command. You'll parse user input\naccording to the [the Redis protocol\nspecification](https://redis.io/topics/protocol).\n",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_echo.go#L11"
    },
    {
      "slug": "set_get",
      "name": "Implement the SET & GET commands",
      "difficulty": "medium",
      "description_md": "In this stage, you'll need to implement the [SET](https://redis.io/commands/set) &\n[GET](https://redis.io/commands/get) commands. For now, you can ignore all extra\noptions for `SET` and just implement the simple form: `SET key value`. You'll add support\nfor expiry in the next stage.\n",
      "marketing_md": "In this stage, you'll need to implement the\n[SET](https://redis.io/commands/set) &\n[GET](https://redis.io/commands/get) commands.\n",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/a58b9d58b33870fe26a164c0e323f809275a7250/internal/test_get_set.go#L11"
    },
    {
      "slug": "expiry",
      "name": "Expiry",
      "difficulty": "medium",
      "description_md": "In this stage, you'll need to support setting a key with an expiry. The\nexpiry is provided using the \"PX\" argument to the\n[SET](https://redis.io/commands/set) command.\n\nThe tester will first send a `SET` command with an expiry, like this: `SET <key> <value> PX <expiry>`.\nThen, it will send a `GET` command to retrieve the value, like this: `GET <key>`. If the key has expired, the \ntester will expect a Null value as the response. Read about \"Null Bulk Strings\" \n[here](https://redis.io/docs/reference/protocol-spec/#resp-bulk-strings) to know how to send a Null value.\n\n{{#lang_is_haskell}}\nThe [time](https://hackage.haskell.org/package/time) package is available\nto use as a dependency.\n{{/lang_is_haskell}}\n",
      "marketing_md": "In this stage, you'll add support for setting a key with an expiry. The\nexpiry is provided using the \"PX\" argument to the\n[SET](https://redis.io/commands/set) command.\n",
      "tester_source_code_url": "https://github.com/codecrafters-io/redis-tester/blob/master/internal/test_expiry.go"
    }
  ]
}
