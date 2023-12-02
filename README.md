# SuperMarket Simulation Homework Project

This is a simple simulation meant to determine the optimal number of employees required to serve a supermarket with certain parameters.

# notes

Using both window event listeners and [worker].onmessage event listeners to avoid pollution where possible

# challenges

large amounts of simulated days led to spawning too many web workers, had to do it in batches. When that wasn't enough, I went for worker pooling instead of creating / destroying single use workers. That worked great, improved performance more than 10x.

# nice to have

disable start button if any input invalid / missing
multimodal distribution for clients
clean up those repetitions in UIController event handlers
finding a good distribution for client arrival. Settled on discrete gaussian with random interference

# simulation rules

variables:
employeeWage: number
employeeCount: number
aisleCount: number
registerCount: number
employeeSpeed: number = sqrt(1/employeeWage \* 20)
employeeBreak: number
employeePeak: number
openHours: number
totalRuntime: openHours \* 60
distributionOfClients = Array of gaussian distribution of clients arrival
distributionOfTimeSpent = Array of gaussian distribution of how long clients spend in the shop. Between 0 and 10

Rules:

- create pool of employees
- each tick a number of distributionOfClients[tick] enter the shop
- a client stays in the shop for a time (seconds) equal to ((a random value from distributionOfTimeSpent) _ 5 _ 60) before going to a register. If time spent < 5, there's a 1/2 chance that the client leaves without buying anything (no register queue, no revenue added)
- when a client queues up at a register, their timeToServe (seconds) is calculated as their timeSpentInShop \* employeeSpeed + 60;
- employees queue up tasks and do their tasks. A task can be to serve a register, or to maintain an aisle, or to take a break.
- employees will have to take a total of 4 breaks equal in time to employeeBreak\*60 (seconds) during the day.
- an aisle needs maintenance if (the number of clients in the shop in the past hour) _ 0.2 is greater than Math.random() _ (number of clients in past hour)
- maintenance of an aisle task takes a number of seconds equal to (the number of clients in the shop in the past hour) / 2 \* 60 (seconds)
- the priority for an employee is break > serve register > maintain aisle unless > 1/3 of aisles require maintenance and are not currently maintained by another worker, in which case priority becomes break > maintain > serve register
- when a client is served at the register, they leave the shop and revenue is gained equal to Math.random() \* time that client had spent in the shop.
- if all registers are queued up so that none will complete their current queue in 900 seconds, clients who would've otherwise entered the shop this tick will instead not enter it. If none completes in less than 450 seconds, only half of the clients for the current tick will enter the shop. If none in less than 200 seconds, only 3/4ths of clients

Simulation output:

totalRevenue,
totalClientsServed,
totalPossibleClients,
totalProfit,
totalWagesPaid,
timeSpentMaintaining,
averageServingTime
