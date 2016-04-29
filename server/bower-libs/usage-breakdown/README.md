## Usage
```coffeescript

# initialize
usage = new nanobox.UsageBreakdown $("body")
usage.build()

# update
usage.update(data)
```

## Data structures
The data structure is an array of "service objects"

##### Single Service Object
``` coffeescript
{type:"service", name:"web1", metrics: {ram:.30, cpu:.25}}
```

##### Data by service structure (array of service objects)
```coffeescript
data = [
  {type:"service",  name:"web1",     metrics: {ram:.30, cpu:.25}},
  {type:"service",  name:"db1",      metrics: {ram:.20, cpu:.25}},
  {type:"internal", name:"platform", metrics: {ram:.10, cpu:.10}},
  {type:"internal", name:"other",    metrics: {ram:.10, cpu:.10}}
]
```

##### Data by metric structure
``` coffeescript
data = [
  {
    metric: "ram",
    data: [
      {type:"service",  name:"web1",     value:.30},
      {type:"service",  name:"db1",      value:.20},
      {type:"internal", name:"platform", value:.10},
      {type:"internal", name:"system",   value:.10}
    ]
  },
  {
    metric: "cpu",
    data: [
      {type:"service",  name:"web1",     value:.25},
      {type:"service",  name:"db1",      value:.25},
      {type:"internal", name:"platform", value:.10},
      {type:"internal", name:"system",   value:.10}
   ]
  }
]
```

NOTE: There are only two types of services, `internal` and `service`. `internal` services are ones that Pagoda Box has installed on the system, while `service`'s are actual services running as part of a users app.
