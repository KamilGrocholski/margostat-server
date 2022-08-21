import scrapClan from "../utils/puppeteer/teamBuilderScraper/index.js"

export const getClan = async (req, res) => {
    const link = req.params.link

    if (!link) return res.status(501).json({ status: 'Error', msg: 'Brak odnośnika do klanu.' })

    const clanCharacters = await scrapClan(link)

    return res.status(201).json({ clanCharacters })
}