const axios = require('axios').default;
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'test',
  brokers: ['localhost:9092']
})

const producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 30000
})

async function getData() {
    await producer.connect();

    const { data } = await axios.get('https://api.kanye.rest');

    console.log(`Quote: ${data.quote}`)
    
    await producer.send({
        topic: 'quote-base',
        messages: [
            { 
                key: 'quote', 
                value: `${JSON.stringify(
                    {
                        quote: data.quote
                    }
                        
                )}`
                , partition: 0
            },
        ],
    
    });
}

setInterval(getData, 5100); //5.1s