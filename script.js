function parsePercentToNumber(pct) {
    if (pct == null) return 0;
    const cleaned = String(pct).trim().replace(/%/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
}

const RAW_MODIFIERS = [
    ["o p?atek mniej", "carnation is faster", "8%", "stackable x3", "carnation", "n/a"],
    ["big ol' eyes", "heed and slight appear and approach much faster", "5%", "not stackable", "heed/slight", "n/a"],
    ["distractless", "slight and heed no longer spawn passively", "-8%", "not stackable", "heed/slight", "n/a"],
    ["more to see", "heed and slight spawn more often", "5%", "not stackable", "heed/slight", "n/a"],
    ["starvation", "slugfish arrives and travels much faster", "8%", "not stackable", "slugfish", "n/a"],
    ["boingfish", "slugfish appears and flings when touched", "2%", "not stackable", "slugfish", "n/a"],
    ["stingman", "elkman appears and kills on contact", "5%", "not stackable", "elkman", "n/a"],
    ["wakey wakey", "dozer appears and wakes up quicker", "5%", "not stackable", "dozer", "ignores \"to sleep for good\" if both are present"],
    ["sunflower", "dozer spawns when carnation does", "5%", "not stackable", "dozer", "n/a"],
    ["to sleep for good", "dozer no longer spawns passively", "-15%", "not stackable", "dozer", "ignores \"wakey wakey\" if both are present"],
    ["double rainbow", "sorrow appears and attacks twice", "5%", "not stackable", "sorrow", "n/a"],
    ["soulful gratitude", "sorrow no longer spawns passively", "-15%", "not stackable", "sorrow", "disables \"double rainbow\" from appearing in modifier pool"],
    ["3rd circle of hell", "timer is set to 3 seconds", "70%", "not stackable", "goatman", "n/a"],
    ["hatered", "goatman is extremely fast", "4%", "not stackable", "goatman", "n/a"],
    ["my many eyes", "litany appears", "15%", "not stackable", "litany", "n/a"],
    ["further perspective", "litany gets more eyes", "4%", "stackable x10", "litany", "only able to be activated if the modifier \"My Many Eyes\" is active"],
    ["uh oh", "doppel appears", "8%", "not stackable", "doppel", "n/a"],
    ["fatal error", "doppel kills on contact", "12%", "not stackable", "doppel", "only available if \"uh oh\" is activated"],
    ["tick tick", "kookoo appears", "8%", "not stackable", "kookoo", "n/a"],
    ["ransomware", "kookoo's timer is a little too expensive", "5%", "not stackable", "kookoo", "only available if \"tick tock\" is activated"],
    ["spyware", "kookoo no longer shows its striking time", "3%", "not stackable", "kookoo", "only available if \"tick tock\" is activated"],
    ["bloatware", "kookoo comes packaged with another kookoo", "5%", "not stackable", "kookoo", "only available if \"tick tock\" is activated"],
    ["crudware", "kookoo sometimes skips a tick", "3%", "not stackable", "kookoo", "only available if \"tick tock\" is activated"],
    ["cheeseware", "kookoo spawns when doombringer screams", "5%", "not stackable", "kookoo", "only available if \"cheesed to meet you\" is activated"],
    ["cheesed to meet you", "doombringer appears", "10%", "not stackable", "doombringer", "n/a"],
    ["boulogne", "+1 doombringer can latch on to you", "2%", "stackable x5", "doombringer", "only available if \"cheesed to meet you\" is activated"],
    ["blue blue cheese", "doombringers scream more often", "2%", "stackable x3", "doombringer", "only available if \"cheesed to meet you\" is activated"],
    ["left to wander", "rue appears", "12%", "not stackable", "rue", "n/a"],
    ["alwaysnearby", "rue is faster", "10%", "not stackable", "rue", "only available if \"left to wander\" is activated"],
    ["whyareyouashamedofgod", "rue can't be flashed anymore", "8%", "not stackable", "rue", "only available if \"left to wander\" is activated"],
    ["wontforgeteachother", "rue's indicator is gone", "8%", "not stackable", "rue", "only available if \"left to wander\" is activated"],
    ["to leave to wander", "ire appears", "8%", "not stackable", "ire", "n/a"],
    ["impatience", "ire acts faster", "4%", "not stackable", "ire", "only available if \"to leave to wander\" is activated"],
    ["more to spite", "ire appears more often", "4%", "not stackable", "ire", "only available if \"to leave to wander\" is activated"],
    ["punctual", "ire doesn't wait for you", "4%", "not stackable", "ire", "only available if \"to leave to wander\" is activated"],
    ["resist", "drain appears", "12%", "not stackable", "drain", "n/a"],
    ["fixation", "drain doesn't wait for you to get close", "4%", "not stackable", "drain", "only available if \"resist\" is activated"],
    ["itjustmakesyouhappy", "mime appears", "10%", "not stackable", "mime", "n/a"],
    ["deeper than you think", "rooms with pits start appearing", "7%", "not stackable", "hazards", "n/a"],
    ["mistake to glory", "all pits are filled with tar", "-27%", "not stackable", "hazards", "only available if \"deeper than you think\" is activated"],
    ["liquid mistakes", "rooms with tar start to appear", "7%", "not stackable", "hazards", "n/a"],
    ["self-hatred", "tar kills you a lot faster", "2%", "not stackable", "hazards", "only available if \"liquid mistakes\" is enabled"],
    ["janitor layoff", "more doors are tampered", "2%", "stackable x3", "hazards", "n/a"],
    ["security alert ", "breaker rooms spawn more often", "7%", "stackable x4", "hazards", "n/a"],
    ["two factor authentication", "`+1 breaker every breaker room", "7%", "stackable x3", "hazards", "n/a"],
    ["acordcable", "plug modules don't appear in breaker rooms anymore", "-12%", "not stackable", "hazards", "n/a"],
    ["water drop", "water sections start to appear", "7%", "not stackable", "hazards", "n/a"],
    ["marketable", "become small (buggy)", "5%", "not stackable", "player", "n/a"],
    ["blink", "you blink from time to time", "2%", "not stackable", "player", "bugged"],
    ["bootbomb", "going too far without wall-kicking makes you explode", "7%", "not stackable", "player", "n/a"],
    ["pipebomb", "holding an item for too long makes it explode", "7%", "not stackable", "player", "n/a"],
    ["my pipebomb :(", "the pipebomb ticks faster", "7%", "not stackable", "player", "only available if \"pipebomb\" is activated"],
    ["exposure", "night vision", "-10%", "not stackable", "player", "n/a"],
    ["ping pong", "slide-jumping into door frames makes you go fast", "-50%", "not stackable", "player", "n/a"],
    ["mach blue", "increases your sprint speed. A lot. Yecool!", "-80%", "stackable x???", "player", "disables bricks, total doors, xp"],
    ["extra", "adds more doors between saferooms", "15%", "stackable x???", "rooms", "n/a"],
    ["de-laddered", "some rooms force you to wallkick to progress", "7%", "not stackable", "rooms", "n/a"],
    ["malformed", "harder rooms start to appear", "5%", "not stackable", "rooms", "n/a"],
    ["deformed", "easy rooms don't appear anymore", "5%", "not stackable", "rooms", "only available if \"malformed\" is activated"],
    ["shapeless", "even harder rooms start to appear (pits + tar included)", "5%", "stackable x2", "rooms", "only available if \"malformed\" is activated"],
    ["how misfortunate", "applies a random modifier", "3%", "stackable x???", "misc", "n/a"],
    ["holy masster", "saferooms open instantly", "1%", "not stackable", "misc", "n/a"],
    ["2.5d", "looking up and down is no more", "2%", "not stackable", "misc", "removes \"water drop\" from modifier pool"],
    ["visions of cruelty", "an obstructive border is put around your eyes", "8%", "not stackable", "misc", "n/a"],
    ["way past cruel", "borderline unplayable", "5%", "not stackable", "misc", "only available if \"VISIONS OF CRUELTY\" is enabled"],
    ["MHEDWMEHIXYF ", "just don't. jxuhuyidewbehojxuhuyideweetjxuhuyledbofqydtedjvksajxyikf.", "-6.67E+32", "not stackable", "misc", "pihsrow pihsrow pihsrow pihsrow pihsrow pihsrow "],
    ["betweenourselves", "allsinisbetweeneachother", "0%", "not stackable", "misc", "bugged"],
    ["the undead comign", "itz tiem ", "1.34%", "not stackable", "event", "n/a"],
    ["the epik duck is coming!!!", "the epik duck is coming!!!", "13.37%", "not stackable", "event", "n/a"],
    ["down down down down", "it's all stairs it's all stairs it's all stairs", "-999900%", "not stackable", "joke", "bugged"],
    ["mistake's beauty", "everything is tar", "2%", "not stackable", "joke", "bugged"],
];

const MODIFIERS = RAW_MODIFIERS.map(([name, description, percent, stackable, category, notes]) => {
    let maxStacks = 1;
    let stackableLabel = String(stackable || "").toLowerCase().trim();
    if (stackableLabel.startsWith("stackable")) {
        const m = stackableLabel.match(/x(\?{3}|\d+)/);
        if (m) {
            maxStacks = m[1] === "???" ? Infinity : parseInt(m[1], 10);
        } else {
            maxStacks = Infinity;
        }
    }
    return {
        name,
        description,
        value: parsePercentToNumber(percent),
        rawPercent: percent,
        maxStacks,
        category,
        notes: notes || "n/a",
    };
});

document.addEventListener("DOMContentLoaded", () => {
    const listEl = document.getElementById("modifiers-list");
    const totalEl = document.getElementById("total");
    const searchEl = document.getElementById("search");
    const categoryEl = document.getElementById("category");

    function extractRequires(notes) {
        if (!notes) return [];
        const reqs = [];
        const regex = /only (?:available|able) to be (?:activated|enabled)? if\s+"([^"]+)"/gi;
        let m;
        while ((m = regex.exec(notes)) !== null) reqs.push(m[1]);
        return reqs;
    }

    const counts = new Map();

    function isSelected(name) {
        return (counts.get(name) || 0) > 0;
    }

    function render() {
        const term = searchEl.value.trim().toLowerCase();
        const filterCat = (categoryEl.value || "").toLowerCase();
        listEl.innerHTML = "";

        MODIFIERS.forEach((mod) => {
            const hay = `${mod.name} ${mod.category} ${mod.description} ${mod.notes}`.toLowerCase();
            if (term && !hay.includes(term)) return;
            if (filterCat && mod.category.toLowerCase() !== filterCat) return;

            const requires = extractRequires(mod.notes);
            const unmet = requires.length > 0 && !requires.every(isSelected);

            const row = document.createElement("div");
            row.className = "modifier-row";
            if (unmet) row.classList.add("unmet");

            const left = document.createElement("div");
            left.className = "mod-left";

            const title = document.createElement("div");
            title.className = "mod-title";
            title.textContent = mod.name;

            const meta = document.createElement("div");
            meta.className = "mod-meta";
            meta.innerHTML = `
        <span class="pill">${mod.category}</span>
        <span class="pill value">${mod.value >= 0 ? "+" : ""}${mod.rawPercent}</span>
        ${mod.maxStacks === 1 ? `<span class="pill">not stackable</span>` : `<span class="pill">stackable ${Number.isFinite(mod.maxStacks) ? `x${mod.maxStacks}` : "x∞"}</span>`}
      `;

            const desc = document.createElement("div");
            desc.className = "mod-desc";
            desc.textContent = mod.description;

            const notes = document.createElement("div");
            notes.className = "mod-notes";
            notes.textContent = mod.notes;

            left.appendChild(title);
            left.appendChild(meta);
            left.appendChild(desc);
            if (mod.notes && mod.notes.toLowerCase() !== "n/a") left.appendChild(notes);

            const right = document.createElement("div");
            right.className = "mod-right";

            if (mod.maxStacks === 1) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = isSelected(mod.name);
                checkbox.addEventListener("change", () => {
                    counts.set(mod.name, checkbox.checked ? 1 : 0);
                    updateTotal();
                    render();
                });
                right.appendChild(checkbox);
            } else {
                const input = document.createElement("input");
                input.type = "number";
                input.min = 0;
                input.step = 1;
                if (Number.isFinite(mod.maxStacks)) input.max = mod.maxStacks;
                input.value = counts.get(mod.name) || 0;
                input.addEventListener("input", () => {
                    let v = Math.max(0, Math.floor(Number(input.value) || 0));
                    if (Number.isFinite(mod.maxStacks)) v = Math.min(v, mod.maxStacks);
                    input.value = v;
                    counts.set(mod.name, v);
                    updateTotal();
                    render();
                });
                right.appendChild(input);
            }

            row.appendChild(left);
            row.appendChild(right);
            listEl.appendChild(row);
        });
    }

    function updateTotal() {
        let total = 0;
        for (const mod of MODIFIERS) {
            const c = counts.get(mod.name) || 0;
            if (!c) continue;
            total += mod.value * c;
        }
        const sign = total >= 0 ? "+" : "";
        totalEl.textContent = `${sign}${Number.isFinite(total) ? total.toFixed(2) : "∞"}%`;
    }

    render();
    updateTotal();

    searchEl.addEventListener("input", render);
    categoryEl.addEventListener("change", render);
 });
