export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  const { module: mod, text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Missing text' });
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: `Você é um assistente especializado no Gestta (Domínio Processos), sistema de gestão de tarefas para escritórios de contabilidade. Responda dúvidas dos colaboradores da Gaideski Contabilidade, em Curitiba-PR, de forma clara, prática e direta. Máximo 3 parágrafos curtos. Se não souber, oriente a registrar a dúvida para o gestor responder.`,
        messages: [{ role: 'user', content: `Módulo: ${mod || 'Geral'}\n\nDúvida: ${text}` }]
      })
    });
 
    const data = await response.json();
    const answer = data.content?.[0]?.text || 'Não foi possível gerar resposta. Aguarde o gestor.';
    res.status(200).json({ answer });
  } catch (e) {
    res.status(500).json({ answer: 'Erro ao conectar com a IA. O gestor responderá em breve.' });
  }
}
