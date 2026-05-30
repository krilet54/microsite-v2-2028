var SUPABASE_URL = 'https://ntumtwhhppvbcjkyfupg.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dW10d2hocHB2YmNqa3lmdXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTcyMTgsImV4cCI6MjA5NTY5MzIxOH0.WRNCxTY8scuvzdo91IpmEaJjEVUTtNFQ_1tolS0cH5g';

if (!window.__micrositeSupabaseClient) {
	if (!window.supabase || typeof window.supabase.createClient !== 'function') {
		console.error('Supabase SDK not loaded before supabase-config.js');
	} else {
		window.__micrositeSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
	}
}

var supabase = window.__micrositeSupabaseClient;
