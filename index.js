const { ApolloServer } = require(`apollo-server`)
const { readFileSync } = require(`fs`)

const members = JSON.parse(readFileSync(`./sample/members.json`, `UTF-8`))
const elections = JSON.parse(readFileSync(`./sample/elections.json`, `UTF-8`))
const bills = JSON.parse(readFileSync(`./sample/bills.json`, `UTF-8`))
const diets = JSON.parse(readFileSync(`./sample/diets.json`, `UTF-8`))
const laws = JSON.parse(readFileSync(`./sample/laws.json`, `UTF-8`))
const meetings = JSON.parse(readFileSync(`./sample/meetings.json`, `UTF-8`))
const minutes = JSON.parse(readFileSync(`./sample/minutes.json`, `UTF-8`))


const typeDefs = readFileSync(`./schema.graphql`, `UTF-8`)
const resolvers = {
    Query: {
        totalMembers: () => members.length,
        allMembers: () => members,
        totalElections: () => elections.length,
        allElections: () => elections,
        totalBills: () => bills.length,
        allBills: () => bills,
        totalDiets: () => diets.length,
        allDiets: () => diets,
        totalLaws: () => laws.length,
        allLaws: () => laws,
        totalMeetings: () => meetings.size,
        allMeetings: () => meetings,
        totalMinutes: () => minutes.size,
        allMinutes: () => minutes
    },
    Member: {
        electedBy: parent => {
            return elections.filter(e => parent.electedBy.includes(e.id))
        },
        submittedBills: parent => {
            return bills.filter(b => parent.submittedBills.includes(b.id))
        },
        attendedDiets: parent => {
            return diets.filter(d => parent.attendedDiets.includes(d.id))
        },
        attendedMinutes: parent => {
            return minutes.filter(m => parent.attendedMinutes.includes(m.id))
        }
    },
    Election: {
        electedMembers: parent => {
            return members.filter(m => parent.electedMembers.includes(m.id))
        }
    },
    Diet: {
        bills: parent => {
            return bills.filter(b => parent.bills.includes(b.id))
        },
        minutes: parent => {
            return minutes.filter(m => parent.minutes.includes(m.id))
        }
    },
    Law: {
        discussedAt: parent => {
            return minutes.filter(m => parent.discussedAt.includes(m.id))
        },
        referencedBy: parent => {
            return laws.filter(l => parent.referencedBy.includes(l.id))
        },
        amendedBy: parent => {
            return bills.filter(b => parent.amendedBy.includes(b.id))
        }
    },
    Bill: {
        submittedBy: parent => {
            return members.filter(m => parent.submittedTo.includes(e.id))
        },
        submittedTo: parent => {
            return diets.find(d => d.id === parent.submittedTo)
        },
        discussedAt: parent => {
            return minutes.filter(m => parent.discussedAt.includes(m.id))
        },
        ammends: parent => {
            return laws.filter(l => parent.ammends.includes(l.id))
        }
    },
    Meeting: {
        members: parent => {
            return meetings.filter(m => meetings.members.includes(m.id))
        },
        minutes: parent => {
            return minutes.filter(m => parent.minutes.includes(m.id))
        }
    },
    Minutes: {
        meeting: parent => {
            return meetings.find(m => m.id === parent.meeting)
        },
        participants: parent => {
            return members.filter(m => parent.participants.includes(m.id))
        },
        heldAt: parent => {
            return diets.find(d => d.id === parent.heldAt)
        },
        discussedBills: parent => {
            return bills.filter(b => parent.discussedBills.includes(b.id))
        },
        discussedLaws: parent => {
            return laws.filter(l => parent.discussedLaws.includes(l.id))
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})
server.listen().then(({url}) => console.log(`GraphQL Service running on ${url}`))