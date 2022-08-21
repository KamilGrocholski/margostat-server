import puppeteer from 'puppeteer'

//SELEKTORY
import { SELECTORS } from './selectors.js'

const scrap = async (clanLink) => {
    const START = new Date()
    console.log(`START: ${ START }`)

    console.log('Otwieram przeglądarkę...')
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            "--incognito",
            '--single-process',
            '--disable-gpu'
        ]
    })

    //Zbiornik na postacie
    const CHARACTERS = []

    //Kontroller, czy udało się wszystko pobrać
    let isDone = false

    const page = await browser.newPage()

    //Wyłącza stylesheet, font i images
    await page.setRequestInterception(true)
    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort()
        }
        else {
            req.continue()
        }
    })

    console.log(`Wchodzę na stronę: ${ clanLink }`)
    await page.goto(clanLink)

    console.log('Sprawdzam liczbę postaci w klanie...')
    const nCharacters = await page.$$eval(SELECTORS.TABLE_ROW, row => row.length)
    console.log(`Liczba postaci w klanie: ${ nCharacters }`)

    let rowsController = 0
    for (let row = 1; row <= nCharacters; row++) {
    // for (let row = 1; row <= 10; row++) { //tTESTOWANIE
        console.log(`Postać nr: ${ row }`)

        //Pobiera nazwę postaci
        const name = await page.$eval(SELECTORS.NICK(row), name => name.textContent)

        //Pobiera poziom postaci
        const lvl = await page.$eval(SELECTORS.LVL(row), lvl => lvl.textContent)

        //Pobiera profesję postaci
        const prof = await page.$eval(SELECTORS.PROF(row), prof => prof.textContent)

        const character = {
            name: name.trim(),
            lvl: parseInt(lvl.trim()),
            prof: prof.trim()
        }
        console.log(character)
        CHARACTERS.push(character)
        rowsController++
    }
    if (rowsController === nCharacters) isDone = true

    console.log('Zamykam przeglądarkę...')
    await browser.close()

    const END = new Date()
    console.log(END)

    const TOTAL_TIME = END - START
    console.log(`${new Date(TOTAL_TIME).toISOString().slice(11, 19)}(hh:mm:ss)`)

    console.log(`Czy udało się pobrać wszystkie postacie: ${ isDone }`)
    return CHARACTERS
}

export default scrap