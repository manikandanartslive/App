import React, { useState, useEffect } from "react";

// Simple single-file demo app using inline styles/classes intended for Tailwind.
export default function App() {
  // Basic routing state
  const [page, setPage] = useState("home");

  // Auth state
  const [studentUser, setStudentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("studentUser")); } catch(e){return null}
  });

  const [adminLogged, setAdminLogged] = useState(() => {
    return !!localStorage.getItem("adminLogged");
  });

  // Admin-managed data: UPI QR (dataURL), whatsapp number, google drive video links
  const [adminData, setAdminData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("adminData")) || { upiQR: null, whatsapp: "+919585406124", videos: [] }; } catch(e){ return { upiQR: null, whatsapp: "+919585406124", videos: [] }; }
  });

  useEffect(() => {
    localStorage.setItem("adminData", JSON.stringify(adminData));
  }, [adminData]);

  useEffect(() => {
    if(studentUser) localStorage.setItem("studentUser", JSON.stringify(studentUser));
    else localStorage.removeItem("studentUser");
  }, [studentUser]);

  // Pricing config (you said: LKG to UKG Rs 100 to 2nd standard 150 their stunning to 4th standard 200 rupees 5th standard 250)
  // Interpreting as ranges and prices per month.
  const pricing = [
    {label: "LKG - UKG", min: 0, max: 0, price: 100},
    {label: "1st - 2nd", min: 1, max: 2, price: 150},
    {label: "3rd - 4th", min: 3, max: 4, price: 200},
    {label: "5th", min: 5, max: 5, price: 250},
    // you can add more
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-600 to-black text-white p-6">
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6">
        <div>
          <h1 className="text-2xl font-extrabold">Manikandan Arts — Drawing Class Online</h1>
          <p className="text-sm text-slate-600">Fun, friendly drawing classes for young learners</p>
        </div>
        <nav className="space-x-3">
          <button onClick={() => setPage("home")} className="px-3 py-1 rounded-md hover:bg-slate-100">Home</button>
          <button onClick={() => setPage("plans")} className="px-3 py-1 rounded-md hover:bg-slate-100">Plans</button>
          <button onClick={() => setPage("login")} className="px-3 py-1 rounded-md hover:bg-slate-100">Student Login</button>
          <button onClick={() => setPage("register")} className="px-3 py-1 rounded-md hover:bg-slate-100">Register</button>
          <button onClick={() => setPage("payment")} className="px-3 py-1 rounded-md hover:bg-slate-100">Payment</button>
          <button onClick={() => setPage("admin")} className="px-3 py-1 rounded-md hover:bg-slate-100">Admin</button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto">
        {page === "home" && <Home pricing={pricing} onEnroll={() => setPage("register")} />}
        {page === "plans" && <Plans pricing={pricing} />}
        {page === "register" && <Register onSuccess={(user) => { setStudentUser(user); setPage("dashboard"); }} />}
        {page === "login" && <Login onLogin={(user)=>{ setStudentUser(user); setPage("dashboard"); }} />}
        {page === "dashboard" && studentUser && <StudentDashboard user={studentUser} adminData={adminData} onLogout={()=>{setStudentUser(null); setPage("home")}} />}
        {page === "payment" && <PaymentPage adminData={adminData} />}
        {page === "admin" && <AdminPage adminData={adminData} setAdminData={setAdminData} adminLogged={adminLogged} setAdminLogged={setAdminLogged} />}

        {!["dashboard"].includes(page) && (
          <footer className="mt-12 text-sm text-slate-600">© {new Date().getFullYear()} Manikandan Arts — Built with ❤️</footer>
        )}
      </main>
    </div>
  );
}

function Home({ pricing, onEnroll }){
  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-3">Welcome to Manikandan Arts</h2>
      <p className="mb-4">Online drawing lessons for small children focusing on creativity, basic shapes, colors, and step-by-step projects.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-semibold">Pricing (Monthly)</h3>
          <ul className="space-y-2">
            {pricing.map(p => (
              <li key={p.label} className="flex justify-between items-center border rounded-md p-3">
                <div>
                  <div className="font-medium">{p.label}</div>
                  <div className="text-sm text-slate-500">Monthly</div>
                </div>
                <div className="text-lg font-bold">₹{p.price}</div>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-slate-600">Discounts: enroll multiple siblings? Contact admin for bundle discounts.</div>
          <button onClick={onEnroll} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">Register Now</button>
        </div>

        <div className="bg-slate-50 p-4 rounded-md">
          <h3 className="font-semibold">Why choose us?</h3>
          <ul className="list-disc pl-5 mt-2 text-slate-600 space-y-1">
            <li>Short fun lessons designed for young children</li>
            <li>Simple projects each week</li>
            <li>Access to recorded lessons (Google Drive links)</li>
            <li>Affordable monthly price</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Plans({ pricing }){
  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Plans & Details</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {pricing.map(p => (
          <div key={p.label} className="border rounded-lg p-4">
            <h3 className="font-semibold">{p.label}</h3>
            <p className="text-slate-600">Monthly fee: <span className="font-bold">₹{p.price}</span></p>
            <p className="mt-2 text-sm text-slate-500">Classes: 2 sessions/week • Duration: 45 mins/session</p>
            <button className="mt-3 px-3 py-1 rounded-md bg-emerald-500 text-white" onClick={() => alert('Choose this plan in Registration')}>Choose this plan</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Register({ onSuccess }){
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleRegister(e){
    e.preventDefault();
    if(!name || !grade || !parentPhone || !username || !password){ setError("Please fill all fields"); return; }
    // Save to localStorage as a simple mock DB
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    if(students.find(s => s.username === username)){ setError("Username already taken"); return; }
    const user = { id: Date.now(), name, grade, parentPhone, username, password };
    students.push(user);
    localStorage.setItem("students", JSON.stringify(students));
    onSuccess(user);
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-3">Student Registration</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleRegister} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Student name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Grade (e.g. LKG, 1, 2)" value={grade} onChange={e=>setGrade(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Parent phone" value={parentPhone} onChange={e=>setParentPhone(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Choose username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Choose password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Register & Continue</button>
      </form>
    </section>
  );
}

function Login({ onLogin }){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e){
    e.preventDefault();
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const user = students.find(s => s.username === username && s.password === password);
    if(!user){ setError("Invalid credentials"); return; }
    onLogin(user);
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-3">Student Login</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
      </form>
    </section>
  );
}

function StudentDashboard({ user, adminData, onLogout }){
  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">Welcome, {user.name}</h2>
          <div className="text-sm text-slate-600">Grade: {user.grade}</div>
        </div>
        <div>
          <button onClick={onLogout} className="px-3 py-1 rounded bg-red-100 text-red-700">Logout</button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Recorded Lessons (from Google Drive)</h3>
        {adminData.videos.length === 0 ? (
          <div className="text-slate-500 mt-2">No videos available yet. Admin will add Drive links.</div>
        ) : (
          <ul className="mt-2 space-y-2">
            {adminData.videos.map((v, i) => (
              <li key={i} className="border rounded p-2">
                <div className="font-medium">Lesson {i+1}</div>
                <a href={v} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm">Open in Drive</a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4">
          <h3 className="font-semibold">Make a Payment</h3>
          <p className="text-sm text-slate-600">Go to the Payment page to see the UPI QR and instructions.</p>
          <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="mt-2 px-3 py-1 bg-emerald-500 text-white rounded">Top of page</button>
        </div>
      </div>
    </section>
  );
}

function PaymentPage({ adminData }){
  const [filePreview, setFilePreview] = useState(null);
  const [message, setMessage] = useState("");

  function handleScreenshotUpload(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function openWhatsApp(){
    // WhatsApp web link with prefilled message. File attachments must be attached manually by the user in WhatsApp.
    const phone = adminData.whatsapp.replace(/[^0-9+]/g, '');
    const text = encodeURIComponent(`Hello, I have completed payment. Student username: [ENTER_USERNAME]. Please find my screenshot attached.`);
    const waLink = `https://wa.me/${phone.replace('+','') || ''}?text=${text}`;
    window.open(waLink, '_blank');
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-lg font-bold mb-3">Payment</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-600">Scan the UPI QR using any UPI app (PhonePe, Google Pay, Paytm). After paying, upload the payment screenshot below and press 'Send to WhatsApp' to notify admin.</p>
          <div className="mt-3 border rounded p-3 text-center">
            {adminData.upiQR ? (
              <img src={adminData.upiQR} alt="UPI QR" className="mx-auto max-w-full h-56 object-contain" />
            ) : (
              <div className="text-slate-500">UPI QR not set by admin yet.</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Upload payment screenshot</label>
          <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="mt-2" />
          {filePreview && <img src={filePreview} alt="preview" className="mt-3 max-h-48 object-contain border rounded" />}

          <div className="mt-3">
            <label className="block text-sm">Message to admin (optional)</label>
            <textarea value={message} onChange={(e)=>setMessage(e.target.value)} className="w-full p-2 border rounded mt-1" placeholder="E.g. Payment for Sept, Student username: ..." />
          </div>

          <div className="mt-3 flex gap-2">
            <button onClick={openWhatsApp} className="px-3 py-2 bg-green-600 text-white rounded">Send to WhatsApp</button>
            <a className="px-3 py-2 rounded border" href="#" onClick={(e)=>{e.preventDefault(); alert('You can download the screenshot locally or attach in WhatsApp window.')}}>Download screenshot</a>
          </div>

        </div>
      </div>
    </section>
  );
}

function AdminPage({ adminData, setAdminData, adminLogged, setAdminLogged }){
  const [user, setUser] = useState({username: '', password: ''});
  const [error, setError] = useState('');

  function login(e){
    e.preventDefault();
    // Simple demo creds: admin / password123
    if(user.username === 'admin' && user.password === 'password123'){
      localStorage.setItem('adminLogged', '1');
      setAdminLogged(true);
      setError('');
      return;
    }
    setError('Invalid admin credentials');
  }

  function logout(){
    localStorage.removeItem('adminLogged');
    setAdminLogged(false);
  }

  function handleUPIUpload(e){
    const f = e.target.files[0];
    if(!f) return;
    const r = new FileReader();
    r.onload = ()=>{
      setAdminData({...adminData, upiQR: r.result});
    };
    r.readAsDataURL(f);
  }

  function addVideo(){
    const url = prompt('Paste Google Drive share link (open in new tab link)');
    if(!url) return;
    setAdminData({...adminData, videos: [...adminData.videos, url]});
  }

  function setWhatsAppNumber(){
    const n = prompt('Enter WhatsApp phone (with +91...)', adminData.whatsapp || '+91');
    if(!n) return;
    setAdminData({...adminData, whatsapp: n});
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
      <h2 className="text-lg font-bold mb-3">Admin</h2>
      {!adminLogged ? (
        <form onSubmit={login} className="space-y-3">
          {error && <div className="text-red-600">{error}</div>}
          <input className="w-full p-2 border rounded" placeholder="Admin username" value={user.username} onChange={e=>setUser({...user, username: e.target.value})} />
          <input type="password" className="w-full p-2 border rounded" placeholder="Admin password" value={user.password} onChange={e=>setUser({...user, password: e.target.value})} />
          <div className="flex gap-2"><button className="px-3 py-2 bg-indigo-600 text-white rounded">Login</button></div>
          <div className="text-sm text-slate-500"></div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Manage site data</div>
              <div className="text-sm text-slate-500">You can upload UPI QR, set WhatsApp number, and add Google Drive lesson links.</div>
            </div>
            <div>
              <button onClick={logout} className="px-3 py-1 rounded bg-red-100 text-red-700">Logout</button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium">Upload UPI QR image</label>
              <input type="file" accept="image/*" onChange={handleUPIUpload} className="mt-2" />
              {adminData.upiQR && <img src={adminData.upiQR} alt="upi" className="mt-2 max-h-40" />}
            </div>

            <div>
              <button onClick={setWhatsAppNumber} className="px-3 py-2 rounded border">Set WhatsApp number (current: {adminData.whatsapp})</button>
            </div>

            <div>
              <button onClick={addVideo} className="px-3 py-2 rounded border">Add Google Drive video link</button>
              <div className="mt-2 space-y-2">
                {adminData.videos.map((v,i)=> (
                  <div key={i} className="text-sm border rounded p-2 flex justify-between items-center">
                    <a href={v} target="_blank" rel="noreferrer" className="text-indigo-600">{v}</a>
                    <button onClick={()=>{ setAdminData({...adminData, videos: adminData.videos.filter((_,j)=>j!==i)}) }} className="text-sm px-2 py-1 rounded bg-red-50">Remove</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
