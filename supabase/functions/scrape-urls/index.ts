const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls } = await req.json();

    if (!urls || !urls.length) {
      return new Response(
        JSON.stringify({ success: false, error: 'URLs are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured. Please connect Firecrawl in settings.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scraping', urls.length, 'URLs');

    const results = await Promise.all(
      urls.map(async (url: string) => {
        try {
          let formattedUrl = url.trim();
          if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            formattedUrl = `https://${formattedUrl}`;
          }

          console.log('Scraping:', formattedUrl);

          const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: formattedUrl,
              formats: ['markdown'],
              onlyMainContent: true,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error('Firecrawl error for', formattedUrl, data);
            return { url: formattedUrl, success: false, error: data.error || 'Failed to scrape' };
          }

          return {
            url: formattedUrl,
            success: true,
            content: data.data?.markdown || data.markdown || '',
            title: data.data?.metadata?.title || data.metadata?.title || '',
          };
        } catch (error) {
          console.error('Error scraping', url, error);
          return { url, success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      })
    );

    const successfulScrapes = results.filter(r => r.success);
    console.log(`Successfully scraped ${successfulScrapes.length}/${urls.length} URLs`);

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scrape-urls:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed to scrape URLs' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
