const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

const mockData = {
    "d953e5fb-a585-4d6b-92d3-ee90697398a0":{
        "author":"J.K.Rowling",
        "title":"Harry Potter and the Philosopher's Stone"
    },
    "d953e5fb-a585-4d6b-92d3-ee90697398a1":{
        "author":"Svetlin Nakov",
        "title":"C# Fundamentals"
    }
};

const singleBook = {
    "author":"J.K.Rowling",
    "title":"Harry Potter and the Philosopher's Stone"
};

const payload = (data) => ({
    status: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
});

describe('Tests', async function() {
    this.timeout(5000);

    let page, browser;

    before(async () => {
        browser = await chromium.launch(/* {headless: false, slowMo: 1000} */);
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('load all books', async () => {
        // mocking server ** - all hosts * - query string
        await page.route('**/jsonstore/collections/books*', (route) => route.fulfill(payload(mockData)));

        await page.goto('http://localhost:5500');

        await page.click('text=Load All Books');

        await page.waitForSelector('text=Harry Potter');

        const rows = await page.$$eval('tbody tr', (rows) => rows.map(r => r.textContent.trim()));
        
        expect(rows[0]).to.contains('Harry Potter');
        expect(rows[0]).to.contains('Rowling');
        expect(rows[1]).to.contains('C# Fundamentals');
        expect(rows[1]).to.contains('Nakov');
    });

    it('can create book', async () => {
        await page.goto('http://localhost:5500');

        await page.fill('form#createForm >> input[name="title"]', 'Title');
        await page.fill('form#createForm >> input[name="author"]', 'Author');

        const [request] = await Promise.all([
            page.waitForRequest(request => request.method() == 'POST'),
            page.click('form#createForm >> text=Submit'),
        ]);

        const data = JSON.parse(request.postData());

        expect(data.title).to.be.equal('Title');
        expect(data.author).to.be.equal('Author');
    });

    it('edit book', async() => {
        await page.route('**/jsonstore/collections/books', (route) => route.fulfill(payload(mockData)));
        await page.route('**/jsonstore/collections/books/*', (route) => route.fulfill(payload(singleBook)));
        await page.goto('http://localhost:5500');

        await page.click('text=Load All Books');

        await page.waitForSelector('text=Harry Potter');
        await page.click(':nth-match(:text("Edit"), 1)');

        const title = await page.inputValue('form#editForm >> input[name="title"]');
        const author = await page.inputValue('form#editForm >> input[name="author"]');

        expect(title).to.be.equal('Harry Potter and the Philosopher\'s Stone');
        expect(author).to.be.equal('J.K.Rowling');

        await page.fill('form#editForm >> input[name="title"]', 'Title');
        await page.fill('form#editForm >> input[name="author"]', 'Author');

        const [request] = await Promise.all([
            page.waitForRequest(request => request.method() == 'PUT'),
            page.click('form#editForm >> text=Save'),
        ]);

        const data = JSON.parse(request.postData());

        expect(data.title).to.be.equal('Title');
        expect(data.author).to.be.equal('Author');
    });
});