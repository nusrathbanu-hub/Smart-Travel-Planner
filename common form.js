document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const data = {
        department: form.department.value,
        doctor: form.doctor.value,
        name: form.name.value,
        age: form.age.value,
        email: form.email.value,
        phone: form.phone.value,
        location: form.location.value,
        address: form.address.value,
        problem: form.problem.value,
        shift: form.shift.value,
        visit: form.visit.value,
    };

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3>Appointment Details:</h3>
        <p><strong>Department:</strong> ${data.department}</p>
        <p><strong>Doctor:</strong> ${data.doctor}</p>
        <p><strong>Patient Name:</strong> ${data.name}</p>
        <p><strong>Age:</strong> ${data.age}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Problem Details:</strong> ${data.problem}</p>
        <p><strong>Appointment Shift:</strong> ${data.shift}</p>
        <p><strong>Visit Type:</strong> ${data.visit.replace('-', ' ')}</p>
    `;
});

const dropdowns=document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown =>{
    const select=dropdown.querySelector('.select');
    const caret=dropdown.querySelector('.caret');
    const menu=dropdown.querySelector('.menu');
    const options=dropdown.querySelectorAll('.menu li');
    const selected=dropdown.querySelector('.selected');

    select.addEventListener('click',()=>{
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option=>{
        option.addEventListener('click',()=>{
            selected.innerText=option.innerText;
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');
            options.forEach(option=>{
                option.classList.remove('active');
            });
            option.classList.add('active');
        });
    });
});
