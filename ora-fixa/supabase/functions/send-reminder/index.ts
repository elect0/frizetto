import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { format, parseISO } from 'https://esm.sh/date-fns@3.6.0';
import { ro } from 'https://esm.sh/date-fns@3.6.0/locale/ro';

console.log('Function "send-reminders" booting up...');
Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    const now = new Date()
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    const {data: appointments, error: queryError} = await supabase.from("appointments").select("id, start_time, profiles ( full_name, email ), services ( name )").is('reminder_sent_at', null).gte("start_time", now.toISOString()).lte("start_time", twentyFourHoursFromNow.toISOString())
    
    if(queryError) {
      throw new Error(`Database query failed: ${queryError.message}`)
    }

    if(!appointments || appointments.length === 0){
      console.log('No upcoming appointments that need reminders.');
      return new Response(JSON.stringify({ message: 'No reminders to send.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    console.log('No upcoming appointments that need reminders.');

    const reminderPromises = appointments.map(async (appointment) =>  
     {

      const formattedDate = format(parseISO(appointment.start_time), 'dd MMMM yyyy, HH:mm:ss', {
        locale: ro
      })

      const reminderMessage = `<!doctypehtml><html lang=ro><meta charset=UTF-8><meta content="width=device-width,initial-scale=1"name=viewport><title>Memento Programare - Frizetto</title><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#fafaf9"><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style=background-color:#fafaf9><tr><td style="padding:20px 0"align=center><table border=0 cellpadding=0 cellspacing=0 role=presentation width=600 style="background-color:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.1)"><tr><td style="padding:40px 20px;background-color:#fff;border-radius:12px 12px 0 0;border-bottom:1px solid #f1f5f9"align=center><h1 style=margin:0;color:#0f172a;font-size:28px;font-weight:700;letter-spacing:-.025em>Frizetto</h1><p style="margin:8px 0 0 0;color:#64748b;font-size:16px;font-weight:500">Băilești<tr><td style="padding:40px 20px 30px 20px"align=center><div style="display:inline-block;width:56px;height:56px;background-color:#f59e0b;border-radius:50%;margin-bottom:24px;line-height:56px;text-align:center;box-shadow:0 4px 12px rgba(245,158,11,.3)"><span style=color:#fff;font-size:24px>⏰</span></div><h2 style="margin:0 0 12px 0;color:#0f172a;font-size:32px;font-weight:700;letter-spacing:-.025em">Ne vedem curând, ${appointment.profiles.full_name}!</h2><p style=margin:0;color:#64748b;font-size:18px;line-height:1.6;font-weight:400>Acesta este un memento prietenos pentru programarea ta care va avea loc în mai puțin de 24 de ore.<tr><td style="padding:0 20px 30px 20px"><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100% style="background-color:#fafaf9;border-radius:12px;border:1px solid #e2e8f0"><tr><td style=padding:32px><table border=0 cellpadding=0 cellspacing=0 role=presentation width=100%><tr><td style=padding-bottom:24px><h3 style="margin:0 0 8px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">SERVICIU</h3><p style=margin:0;color:#0f172a;font-size:18px;font-weight:600>${appointment.services.name}<tr><td style=padding-bottom:24px><h3 style="margin:0 0 8px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">CÂND</h3><p style=margin:0;color:#0f172a;font-size:18px;font-weight:600>${formattedDate}<tr><td><h3 style="margin:0 0 8px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">UNDE</h3><p style=margin:0;color:#0f172a;font-size:18px;font-weight:600>Strada Victoriei 155, Băilești, Dolj</table></table><tr><td style="padding:0 20px 30px 20px"align=center><table border=0 cellpadding=0 cellspacing=0 role=presentation><tr><td style=padding-right:12px><a href=https://frizetto.com/api/calendar/${appointment.id}.ics style="display:inline-block;padding:14px 28px;background-color:#f59e0b;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;box-shadow:0 2px 4px rgba(245,158,11,.2)">➕ Adaugă în Calendar</a><td style=padding-left:12px><a href="https://maps.google.com/?q=Strada+Victoriei+155,+Băilești"style="display:inline-block;padding:14px 28px;background-color:#fff;color:#0f172a;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;border:1px solid #e2e8f0">🗺️ Obține Direcții</a></table><tr><td style="padding:0 20px 30px 20px"align=center><p style="margin:0 0 8px 0;color:#64748b;font-size:16px;font-weight:400">Ai nevoie să anulezi sau să reprogramezi?</p><a href=https://frizetto.com/cont/programari style=color:#f59e0b;text-decoration:none;font-size:16px;font-weight:600>Gestionează programarea ta</a><tr><td style="padding:0 20px 30px 20px"><div style="background-color:#fafaf9;padding:28px;border-radius:12px;border:1px solid #e2e8f0"><h3 style="margin:0 0 16px 0;color:#0f172a;font-size:18px;font-weight:600">Ce trebuie să știi înainte să vii:</h3><ul style=margin:0;padding-left:20px;color:#475569;font-size:16px;line-height:1.6;font-weight:400><li style=margin-bottom:8px>Te rugăm să ajungi cu 5 minute mai devreme.<li style=margin-bottom:8px>Acceptăm plăți cash.<li style=margin-bottom:0>Parcarea este disponibilă pe stradă.</ul></div><tr><td style="padding:32px 20px;background-color:#f59e0b;border-radius:0 0 12px 12px"align=center><table border=0 cellpadding=0 cellspacing=0 role=presentation><tr><td style=padding-right:16px><a href=# style=display:inline-block;width:44px;height:44px;background-color:#3b5998;border-radius:50%;line-height:44px;text-align:center;text-decoration:none><span style=color:#fff;font-size:18px>f</span></a><td style=padding-right:16px><a href=# style=display:inline-block;width:44px;height:44px;background-color:#e4405f;border-radius:50%;line-height:44px;text-align:center;text-decoration:none><span style=color:#fff;font-size:18px>📷</span></a><td><a href=# style=display:inline-block;width:44px;height:44px;background-color:#64748b;border-radius:50%;line-height:44px;text-align:center;text-decoration:none><span style=color:#fff;font-size:18px>🌐</span></a></table><p style="margin:24px 0 4px 0;color:#fff;font-size:16px;font-weight:600">Frizetto © 2025<p style="margin:0 0 16px 0;color:#fef3c7;font-size:14px;font-weight:400">Strada Victoriei 135, Băilești, Dolj</table></table>`
      const response = await fetch('https://api.resend.com/emails', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
        },
        body: JSON.stringify({
          from: "Reminder Programare <reminders@frizetto.ro>",
          to: [appointment.profiles.email],
          subject: 'Mai puțin de 24h până la programarea ta!',
          html: reminderMessage
        })
      })
      if(!response.ok){
        throw new Error(`Failed to send email for appointment ${appointment.id}`)
      }
      console.log(`Email sent for appointment ${appointment.id}`)

      const {error: updateError} = await supabase.from("appointments").update({reminder_sent_at: new Date().toISOString}).eq("id", appointment.id)
      if(updateError) {
        console.error(`CRITICAL: Failed to update reminder status for appointment ${appointment.id}`)
      }
    })

    await Promise.all(reminderPromises)

    return new Response(JSON.stringify({message: `Successfully processed ${appointments.length} reminders`}), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    })
  } catch (err) {
    console.error("An error occurred:", err.message)
    return new Response(JSON.stringify({ message: err?.message ?? err }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500 
    })
  }
})
