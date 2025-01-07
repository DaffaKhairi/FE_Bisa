// Simpan atau Ambil Token dari Local Storage
function setAccessToken(token) {
  localStorage.setItem("accessToken", token);
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}
console.log(getAccessToken());

// Login
async function postLogin() {
  const url = "http://localhost:9876/users/login";
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors", // Enable CORS
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        role: "teacher",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Access Token:", data.accessToken);

    // Simpan token di localStorage
    setAccessToken(data.accessToken);

    // Arahkan ke dashboard
    window.location.href = "/HTML/dashboard.html";
  } catch (error) {
    console.error("Login failed: Email and Password not match");
    alert("Invalid credentials. Please try again.");
  }
}

// Mengecek dan Mengarahkan Halaman Berdasarkan Token
function checkAccessToken() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    if (window.location.pathname !== "/HTML/login.html") {
      window.location.href = "/HTML/login.html";
    }
  } else {
    if (window.location.pathname !== "/HTML/dashboard.html") {
      window.location.href = "/HTML/dashboard.html";
    }
  }
}



// SignUp
async function postSignUp() {
  const url = "http://localhost:9876/users/signup";
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors", // Enable CORS
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
        role: "teacher",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // Log access token and refresh token

    window.location.href = "/HTML/role.html";
  } catch (error) {
    console.error("Error", error.massage);
  }
}

// Class Enrolade :)
async function fetchAllClasses() {
  const apiUrl = "http://localhost:9876/class/enrolled";
  const accessToken = getAccessToken();

  if (!accessToken) {
    console.error("Access Token is missing. Redirecting to login.");
    window.location.href = "/HTML/login.html";
    return;
  }

  try {
    console.log("Sending request with Access Token:", accessToken);

    const response = await fetch(apiUrl, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`HTTP Error: ${response.status}, Message: ${errorBody}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const classes = await response.json();
    console.log("Fetched Classes:", classes.enrolledClasses);

    displayClass(classes)
  } catch (error) {
    console.error("Error fetching all classes:", error);
  }
}

function displayClass(classes) {
  const classContainer = document.getElementById("class");
  classContainer.innerHTML = "";

  classes.enrolledClasses.forEach((cls) => {
    const classElement = `
      <a href="/html/detailclass.html" class="class-item" data-class='${JSON.stringify(cls)}'>
          <div class="w-64 flex flex-col gap-4 rounded-lg bg-white border border-gray-200">
              <div class="w-full flex flex-col gap-2">
                  <img src="/src/physics.jpg" alt="" class="w-full rounded-t-lg">
                  <div class="flex flex-col gap-1 justify-center px-4">
                      <h1 class="font-bold">${cls.ClassName}</h1>
                      <p class="text-xs font-light">${cls.ClassDescription}</p>
                  </div>
                  <div class="w-full px-4 pb-4 text-center">
                      <p class="w-full bg-gray-700 text-white p-1 text-sm rounded-2xl">${cls.Materials == null ? 0 : cls.Materials} Materials</p>
                  </div>
              </div>
          </div>
      </a>
      `;

    // Tambahkan elemen ke kontainer
    classContainer.innerHTML += classElement;
  });

  // Tambahkan event listener untuk menyimpan data ke localStorage
  const classItems = document.querySelectorAll(".class-item");
  classItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault(); // Hindari pengalihan otomatis
      const classData = item.getAttribute("data-class");
      localStorage.setItem("selectedClass", classData);
      window.location.href = "/html/detailclass.html"; // Arahkan ke halaman detail
    });
  });
}


async function fetchAllMaterial(idClass) {
  const apiUrl = `http://localhost:9876/materials/class/${idClass}`;
  const accessToken = getAccessToken();

  if (!accessToken) {
    console.error("Access Token is missing. Redirecting to login.");
    window.location.href = "/HTML/login.html";
    return;
  }

  try {
    console.log("Sending request with Access Token:", accessToken);

    const response = await fetch(apiUrl, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`HTTP Error: ${response.status}, Message: ${errorBody}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const materials = await response.json();
    console.log("Fetched Classes:", materials);
    displayMaterial(materials)
  } catch (error) {
    console.error("Error fetching all classes:", error);
  }
}

// Digunakan Untuk UI Materi
function displayMaterial(Materials) {
  const classContainer = document.getElementById("materials");
  classContainer.innerHTML = "";

  Materials.forEach((material) => {
    const classElement = `
      <a href="/html/detailclass.html" class="material-item" data-material='${JSON.stringify(material)}'>
          <div class="w-64 flex flex-col gap-4 rounded-lg bg-white border border-gray-200">
            <div class="w-full flex flex-col gap-4 p-4">
              <div class="flex flex-col gap-1 justify-center ">
                <h1 class="font-bold">${material.Title}</h1>
                <p class="text-xs font-light">${material.Description}</p>
              </div>
              <div class="w-full text-center">
                <p class="w-full bg-gray-700 text-white p-1 text-sm rounded-lg">Enter</p>
              </div>
            </div>
          </div >
      </a>
      `;

    // Tambahkan elemen ke kontainer
    classContainer.innerHTML += classElement;
  });

  // Tambahkan event listener untuk menyimpan data ke localStorage
  const classItems = document.querySelectorAll(".material-item");
  classItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault(); // Hindari pengalihan otomatis
      const classData = item.getAttribute("data-material");
      localStorage.setItem("selectedMaterial", classData);
      window.location.href = "/html/detailmaterial.html"; // Arahkan ke halaman detail
    });
  });
}


