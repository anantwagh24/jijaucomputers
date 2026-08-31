<?php
/**
 * Template Name: Live Service & Repair Tracking Portal
 *
 * @package Jijau_Computers
 */

get_header();

$whatsapp = get_theme_mod('jijau_whatsapp', '918805607908');
?>

<main class="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    <div class="text-center space-y-2 max-w-2xl mx-auto mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
            <span>Live Repair Progress Tracker</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Track Your Laptop & PC Repair
        </h1>
        <p class="text-xs sm:text-sm text-slate-600">
            Enter your Service Ticket ID (e.g. <strong>JC-SRV-1001</strong>) or registered phone number to check diagnosis and repair timeline.
        </p>
    </div>

    <!-- Ticket Search Box -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 mb-8">
        <div class="flex flex-col sm:flex-row items-center gap-3">
            <div class="relative flex-1 w-full">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
                <input
                    type="text"
                    id="ticket-search-input"
                    value="JC-SRV-1001"
                    placeholder="Enter Ticket ID (JC-SRV-1001)..."
                    class="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-2xl text-xs sm:text-sm outline-none focus:border-blue-600 font-mono"
                />
            </div>
            <button
                type="button"
                id="search-ticket-btn"
                class="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow transition-colors"
            >
                Search Ticket
            </button>
        </div>
    </div>

    <!-- Active Ticket Progress Timeline (Demo Card) -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
                <span class="text-xs font-mono font-bold text-blue-600">JC-SRV-1001</span>
                <h3 class="text-lg font-black text-slate-900">ASUS ROG Strix G15 (GPU Fan & Repasting)</h3>
                <span class="text-xs text-slate-500">Customer: Rahul Deshmukh</span>
            </div>
            <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase self-start">
                Status: Repairing
            </span>
        </div>

        <!-- 6-Stage Timeline -->
        <div class="space-y-4">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Pipeline</h4>
            <div class="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px] font-bold">
                <div class="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">1. Received</div>
                <div class="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">2. Inspected</div>
                <div class="p-2.5 rounded-xl bg-blue-600 text-white ring-2 ring-blue-300">3. Repairing</div>
                <div class="p-2.5 rounded-xl bg-slate-100 text-slate-500">4. Parts Wait</div>
                <div class="p-2.5 rounded-xl bg-slate-100 text-slate-500">5. Ready</div>
                <div class="p-2.5 rounded-xl bg-slate-100 text-slate-500">6. Delivered</div>
            </div>
        </div>

        <!-- Technician Remarks -->
        <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-xs space-y-1 text-slate-800">
            <span class="font-bold text-blue-900 block">Technician Diagnostic Notes:</span>
            <p>Original ASUS replacement cooling fan installed. Thermal Grizzly Kryonaut thermal paste applied. 3DMark stress test running.</p>
        </div>

        <!-- WhatsApp Technician Chat -->
        <div class="flex justify-end pt-2">
            <a
                href="https://wa.me/<?php echo esc_attr($whatsapp); ?>?text=<?php echo urlencode('Hi Jijau Computers team, checking for an update on my repair ticket #JC-SRV-1001.'); ?>"
                target="_blank"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow"
            >
                <i data-lucide="message-square" class="w-4 h-4"></i>
                <span>Chat with Service Technician on WhatsApp</span>
            </a>
        </div>
    </div>
</main>

<?php
get_footer();
