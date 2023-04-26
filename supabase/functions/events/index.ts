import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const incomingObj = await req.json();
  let message = {
    success: false
  };

  try {

    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');

    /**
     * Check if a host is registered. 
     */
    let host = await supabase
      .from('whitelist')
      .select('id')
      .eq('host', incomingObj.host)
      .eq('api_key', incomingObj.api_key);

    if (host.error) throw host.error;

    if (!host.data.length) throw { message: "The host is not registered." };

    /**
     * Insert data.
     */
    const insertResponse = await supabase
      .from('events')
      .insert(
        {
          host: host.data[0].id,
          data: incomingObj.attributionData
        }
      );

    if (insertResponse.error) throw insertResponse.error;

    message.success = true;

    return new Response(
      JSON.stringify(message),
      { headers: { "Content-Type": "application/json" } },
    )

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

})