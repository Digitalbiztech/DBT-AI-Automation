/**
 * Utility for fetching medical research abstracts directly from PubMed (NCBI E-utilities).
 * Bypasses the need for a Python backend.
 */

export async function fetchPubMedAbstracts(query: string, limit: number = 2): Promise<string> {
  try {
    // 1. Search PubMed for PMIDs matching the query
    // We strictly filter for Humans and English to avoid irrelevant animal or non-English studies.
    const advancedQuery = `${query.trim()} AND "human"[Filter] AND "english"[Filter]`;

    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(advancedQuery)}&retmax=${limit}&retmode=json&sort=relevance`;
    
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    const pmids: string[] = searchData.esearchresult?.idlist || [];
    
    if (!pmids || pmids.length === 0) {
      return "";
    }

    // 2. Fetch the actual Text Abstracts using EFetch
    let combinedAbstracts = "";
    for (const pmid of pmids) {
      const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&retmode=text&rettype=abstract`;
      const fetchRes = await fetch(fetchUrl);
      const text = await fetchRes.text();
      const url = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
      combinedAbstracts += `${text}\nSOURCE LINK: ${url}\n\n---\n\n`;
    }

    return combinedAbstracts;
  } catch (error) {
    console.error("PubMed Fetch Error:", error);
    return "";
  }
}

export interface PubMedArticle {
  pmid: string;
  title: string;
  pubDate: string;
  journal: string;
  authors: string;
  url: string;
}

export async function fetchPubMedArticles(query: string, limit: number = 3): Promise<PubMedArticle[]> {
  try {
    const advancedQuery = `${query.trim()} AND "human"[Filter] AND "english"[Filter]`;
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(advancedQuery)}&retmax=${limit}&retmode=json&sort=relevance`;
    
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    const pmids: string[] = searchData.esearchresult?.idlist || [];
    if (!pmids || pmids.length === 0) {
      return [];
    }

    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json`;
    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();
    
    const articles: PubMedArticle[] = [];
    
    for (const pmid of pmids) {
      const docInfo = summaryData.result?.[pmid];
      if (docInfo) {
        let title = docInfo.title || "Untitled Article";
        if (title.endsWith(".")) {
          title = title.slice(0, -1);
        }
        
        const authorList: any[] = docInfo.authors || [];
        let authorsStr = "";
        if (authorList.length > 0) {
          if (authorList.length === 1) {
            authorsStr = authorList[0].name;
          } else if (authorList.length === 2) {
            authorsStr = `${authorList[0].name} & ${authorList[1].name}`;
          } else {
            authorsStr = `${authorList[0].name} et al.`;
          }
        }
        
        articles.push({
          pmid,
          title,
          pubDate: docInfo.pubdate || "",
          journal: docInfo.source || "",
          authors: authorsStr,
          url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
        });
      }
    }
    
    return articles;
  } catch (error) {
    console.error("PubMed Articles Fetch Error:", error);
    return [];
  }
}

