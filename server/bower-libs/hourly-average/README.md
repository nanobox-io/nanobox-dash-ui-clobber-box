
## Usage
```coffeescript

# initialize
hourly = new nanobox.HourlyAverage $("body")
hourly.build()

# update
hourly.update(data)
```

## Data structure
The data structure is an array of "time objects"

##### Single Time Object
``` coffeescript
{time: "00:00", stat: "0.55"}
```

##### Full Data Structure (array of time objects)
```coffeescript
data = [
  {time: "00:00", stat: "0.55"}, {time: "00:15", stat: "0.79"}, {time: "00:30", stat: "0.84"}, {time: "00:45", stat: "0.95"},
  {time: "01:00", stat: "0.52"}, {time: "01:15", stat: "0.85"}, {time: "01:30", stat: "0.85"}, {time: "01:45", stat: "0.95"},
  {time: "02:00", stat: "0.83"}, {time: "02:15", stat: "0.71"}, {time: "02:30", stat: "0.89"}, {time: "02:45", stat: "0.55"},
  {time: "03:00", stat: "0.79"}, {time: "03:15", stat: "0.74"}, {time: "03:30", stat: "0.86"}, {time: "03:45", stat: "0.88"},
  {time: "04:00", stat: "0.96"}, {time: "04:15", stat: "0.88"}, {time: "04:30", stat: "0.85"}, {time: "04:45", stat: "0.71"},
  {time: "05:00", stat: "0.86"}, {time: "05:15", stat: "0.85"}, {time: "05:30", stat: "0.85"}, {time: "05:45", stat: "0.81"},
  {time: "06:00", stat: "0.85"}, {time: "06:15", stat: "0.85"}, {time: "06:30", stat: "0.73"}, {time: "06:45", stat: "0.85"},
  {time: "07:00", stat: "0.89"}, {time: "07:15", stat: "0.85"}, {time: "07:30", stat: "0.86"}, {time: "07:45", stat: "0.85"},
  {time: "08:00", stat: "0.97"}, {time: "08:15", stat: "0.80"}, {time: "08:30", stat: "0.85"}, {time: "08:45", stat: "0.71"},
  {time: "09:00", stat: "0.85"}, {time: "09:15", stat: "0.77"}, {time: "09:30", stat: "0.85"}, {time: "09:45", stat: "0.94"},
  {time: "10:00", stat: "0.85"}, {time: "10:15", stat: "0.80"}, {time: "10:30", stat: "0.88"}, {time: "10:45", stat: "0.85"},
  {time: "11:00", stat: "0.72"}, {time: "11:15", stat: "0.85"}, {time: "11:30", stat: "0.85"}, {time: "11:45", stat: "0.90"},
  {time: "12:00", stat: "0.85"}, {time: "12:15", stat: "0.87"}, {time: "12:30", stat: "0.85"}, {time: "12:45", stat: "0.90"},
  {time: "13:00", stat: "0.85"}, {time: "13:15", stat: "0.81"}, {time: "13:30", stat: "0.80"}, {time: "13:45", stat: "0.90"},
  {time: "14:00", stat: "0.70"}, {time: "14:15", stat: "0.85"}, {time: "14:30", stat: "0.73"}, {time: "14:45", stat: "0.85"},
  {time: "15:00", stat: "0.90"}, {time: "15:15", stat: "0.98"}, {time: "15:30", stat: "0.89"}, {time: "15:45", stat: "0.85"},
  {time: "16:00", stat: "0.85"}, {time: "16:15", stat: "0.92"}, {time: "16:30", stat: "0.85"}, {time: "16:45", stat: "0.87"},
  {time: "17:00", stat: "0.85"}, {time: "17:15", stat: "0.85"}, {time: "17:30", stat: "0.81"}, {time: "17:45", stat: "0.77"},
  {time: "18:00", stat: "0.97"}, {time: "18:15", stat: "0.70"}, {time: "18:30", stat: "0.77"}, {time: "18:45", stat: "0.74"},
  {time: "19:30", stat: "0.85"}, {time: "19:15", stat: "0.85"}, {time: "19:30", stat: "0.90"}, {time: "19:45", stat: "0.75"},
  {time: "20:00", stat: "0.85"}, {time: "20:15", stat: "0.85"}, {time: "20:30", stat: "0.90"}, {time: "20:45", stat: "0.75"},
  {time: "21:00", stat: "0.90"}, {time: "21:15", stat: "0.85"}, {time: "21:30", stat: "0.85"}, {time: "21:45", stat: "0.97"},
  {time: "22:00", stat: "0.83"}, {time: "22:15", stat: "0.85"}, {time: "22:30", stat: "0.77"}, {time: "22:45", stat: "0.84"},
  {time: "23:00", stat: "0.85"}, {time: "23:15", stat: "0.85"}, {time: "23:30", stat: "0.52"}, {time: "23:45", stat: "0.88"}
]
```
