import scrapClan from "../utils/puppeteer/teamBuilderScraper/index.js"

export const getClan = async (req, res) => {
    const link = req.params.link

    if (!link) return res.status(401).json({ status: 'Error', msg: 'Brak odnośnika do strony klanowej.' })

    try {
        const clanCharacters = await scrapClan(link)
        if (!clanCharacters) return res.status(501).json({ status: 'Error', msg: 'Nieprawdiłowy odnośnik do strony klanowej.' })
        return res.status(201).json({ clanCharacters, status: 'Success' })
    } catch (err) {
        console.log(err)
        return res.status(501).json({ status: 'Error', msg: 'Nieprawdiłowy odnośnik do strony klanowej.' })
    }
}