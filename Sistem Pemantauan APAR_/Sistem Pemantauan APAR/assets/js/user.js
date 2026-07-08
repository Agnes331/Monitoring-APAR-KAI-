let aparData = JSON.parse(localStorage.getItem("aparData")) || [];

/* =========================
   KAI CUSTOM MODAL
   ========================= */
function showModal(icon, title, message) {
    const modal = document.getElementById('kaiModal');
    if (!modal) {
        alert(message);
        return;
    }
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalIcon.className = 'modal-icon icon-' + icon;
    modalIcon.innerHTML = icon === 'error' ? '<i class="fas fa-circle-exclamation"></i>' :
                          icon === 'success' ? '<i class="fas fa-circle-check"></i>' :
                          icon === 'warning' ? '<i class="fas fa-triangle-exclamation"></i>' :
                          '<i class="fas fa-circle-info"></i>';
    modalTitle.textContent = title;
    modalBody.textContent = message;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('kaiModal');
    if (modal) modal.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('kaiModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if(e.target === this) closeModal();
        });
    }
    document.addEventListener('keydown', function(e) {
        if(e.key === 'Escape') closeModal();
    });
});

/* =========================
   STATE MONITORING AKTIF
   ========================= */
let currentSession = JSON.parse(localStorage.getItem("currentSession")) || null;

/* =========================
   INIT
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
    if (currentSession) {
        loadSessionToForm();
    } else {
        createNewSession();
    }

    renderTable();
});

/* =========================
   FORM BARU (RESET SESSION)
   ========================= */
function newForm() {
    createNewSession();
    clearForm();
    renderTable();
}

function createNewSession() {
    currentSession = {
        id: Date.now(),
        noRef: generateRef(),
        tanggal: "",
        businessArea: "",
        bulan: "",
        catatan: ""
    };

    saveSession();
}

/* =========================
   GENERATE NO REFERENSI
   ========================= */
function generateRef() {
    return "APAR-" + Date.now();
}

/* =========================
   LOAD SESSION KE FORM
   ========================= */
function loadSessionToForm() {
    const noRef = document.getElementById("noRef");
    const tanggal = document.getElementById("tanggal");
    const businessArea = document.getElementById("businessArea");
    const bulan = document.getElementById("bulan");

    if (noRef) noRef.value = currentSession.noRef;
    if (tanggal) tanggal.value = currentSession.tanggal;
    if (businessArea) businessArea.value = currentSession.businessArea;
    if (bulan) bulan.value = currentSession.bulan;
}

/* =========================
   SAVE SESSION
   ========================= */
function saveSession() {
    localStorage.setItem("currentSession", JSON.stringify(currentSession));
}

/* =========================
   ADD ROW APAR (DALAM SESSION YANG SAMA)
   ========================= */
function addRow() {

    const data = {
        id: Date.now(),
        sessionId: currentSession.id,

        noRef: currentSession.noRef,
        tanggal: document.getElementById("tanggal").value,
        businessArea: document.getElementById("businessArea").value,
        bulan: document.getElementById("bulan").value,

        kodeAsset: document.getElementById("kodeAsset").value,
        merk: document.getElementById("merk").value,
        tipe: document.getElementById("tipe").value,
        media: document.getElementById("media").value,
        kapasitas: document.getElementById("kapasitas").value,
        lokasi: document.getElementById("lokasi").value,
        tglCek: document.getElementById("tglCek").value,
        jamCek: document.getElementById("jamCek").value,
        isiUlang: document.getElementById("isiUlang").value,
        expired: document.getElementById("expired").value,
        indikator: document.getElementById("indikator").value,
        fisik: document.getElementById("fisik").value,
        tindak: document.getElementById("tindak").value,
        paraf: document.getElementById("paraf").value || ""
    };

    if (!data.kodeAsset || !data.merk) {
        showModal('error', 'Data Belum Lengkap', 'Kode Asset & Merk wajib diisi!');
        return;
    }

    aparData.push(data);
    saveData();

    renderTable();
    clearInputRow();
}

/* =========================
   SAVE DATA KE LOCALSTORAGE
   ========================= */
function saveData() {
    localStorage.setItem("aparData", JSON.stringify(aparData));
}

/* =========================
   RENDER TABLE (1 SESSION SAJA)
   ========================= */
function renderTable() {

    const tbody = document.getElementById("tableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const filtered = aparData.filter(x => x.sessionId === currentSession.id);

    filtered.forEach((item, index) => {

        tbody.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.kodeAsset}</td>
            <td>${item.merk}</td>
            <td>${item.tipe}</td>
            <td>${item.media}</td>
            <td>${item.kapasitas}</td>
            <td>${item.lokasi}</td>
            <td>${item.tglCek}</td>
            <td>${item.jamCek}</td>
            <td>${item.isiUlang}</td>
            <td>${item.expired}</td>
            <td>${item.indikator}</td>
            <td>${item.fisik}</td>
            <td>${item.tindak}</td>
            <td>${item.paraf}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteRow(${item.id})">
                    Hapus
                </button>
            </td>
        </tr>
        `;
    });

    updateBadge(filtered.length);
}

/* =========================
   DELETE ROW
   ========================= */
function deleteRow(id) {
    aparData = aparData.filter(x => x.id !== id);
    saveData();
    renderTable();
}

/* =========================
   BADGE
   ========================= */
function updateBadge(total) {
    const badge = document.querySelector(".badge");
    if (badge) badge.innerText = `${total} Data`;
}

/* =========================
   CLEAR INPUT ROW
   ========================= */
function clearInputRow() {

    const ids = [
        "kodeAsset",
        "merk",
        "tipe",
        "kapasitas",
        "lokasi",
        "tglCek",
        "jamCek",
        "isiUlang",
        "expired",
        "fisik",
        "tindak"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
}

/* =========================
   SAVE FORM (FINAL KE HISTORY)
   ========================= */
function saveForm() {

    currentSession.tanggal = document.getElementById("tanggal").value;
    currentSession.businessArea = document.getElementById("businessArea").value;
    currentSession.bulan = document.getElementById("bulan").value;
    currentSession.catatan = document.querySelector("textarea")?.value || "";

    saveSession();

    let history = JSON.parse(localStorage.getItem("historyAPAR")) || [];
    history.push(currentSession);

    localStorage.setItem("historyAPAR", JSON.stringify(history));

    showModal('success', 'Tersimpan', 'Data berhasil disimpan ke History!');
}