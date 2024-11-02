const canvas = document.getElementById('telajogo');

const ctx = canvas.getContext("2d");

canvas.width = 800
canvas.height = 600

let nave = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    angle: 0,
    velocidade: 0,
    rotacao: 0,
    tiros: []
};

let asteroides = [];
let pontuacao = 0;
let vidas = 3;
let ultimoTiro = 0;
const intervaloEntreTiros=300;
const audio = new Audio('./musica/musica.mp3')
const imagensAsteroides = [];

for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `./img/asteroid${i}.png`;
    imagensAsteroides.push(img);
}

document.getElementById("pontuacao").innerText = `Pontuação: ${pontuacao}`;
document.getElementById("vidas").innerText = `Vidas: ${vidas}`


function iniciarMusica() {
    audio.loop = true; 
    audio.play().catch(e=>{console.error("erro ao tentar tocar a musica",e)});
}

document.addEventListener("keydown", teclaPressionada);
document.addEventListener("keyup", teclaSolta);

function teclaPressionada(e) {

    if (e.key=="ArrowUp") {

        nave.velocidade=2;


        
    }else if(e.key==="ArrowLeft"){

        nave.rotacao=-0.1

    }else if(e.key==="ArrowRight"){

        nave.rotacao=0.1

    }else if(e.key===" "){

        atirar()    
    };
       
}

function teclaSolta(e) {

    if (e.key==="ArrowUp") {

        nave.velocidade=0;
        
    }else if(e.key==="ArrowLeft"||e.key==="ArrowRight"){

        nave.rotacao=0;
    }

}


function atirar() {

    const agora=Date.now()
    if(agora-ultimoTiro<intervaloEntreTiros)return


    const tiro={
        x:nave.x +Math.cos(nave.angle)*nave.width,

        y:nave.y +Math.sin(nave.angle)*nave.width,

        dx: Math.cos(nave.angle)*5,

        dy: Math.sin(nave.angle)*5


    };

    nave.tiros.push(tiro);
    ultimoTiro=agora
    
}



function criarAsteroids() {

    for (let i = 0; i < 5; i++) {
        adicionarAsteroide();

    }

}



function adicionarAsteroide() {

    let x, y;

    if (Math.random() < 0.5) {

        x = Math.random() < 0.5 ? 0 : canvas.width;

        y = Math.random() * canvas.height;


    } else {
        y = Math.random() < 0.5 ? 0 : canvas.height;

        x = Math.random() * canvas.width;
    }
    let asteroide = {
        x: x,

        y: y,

        dx: (Math.random() - 0.5) * 2,

        dy: (Math.random() - 0.5) * 2,

        radius: Math.random() * 30 + 15,

        imagem: imagensAsteroides[Math.floor(Math.random() * imagensAsteroides.length)]


    };

    asteroides.push(asteroide)
}


function desenharNave() {

    ctx.save();

    ctx.translate(nave.x, nave.y)

    ctx.rotate(nave.angle);

    ctx.beginPath()

    ctx.moveTo(-nave.width / 2, nave.height / 2)

    ctx.lineTo(nave.width / 2, 0);

    ctx.lineTo(-nave.width / 2, -nave.height / 2);

    ctx.closePath();

    ctx.fillStyle = "white"

    ctx.fill();

    ctx.restore();

}

function desenharTiros() {

    ctx.fillStyle = "blue"

    for (let tiro of nave.tiros) {
        ctx.beginPath()

        ctx.arc(tiro.x, tiro.y, 2, 0, Math.PI * 2)


        ctx.fill();

    }
}


function desenharAsteroides() {


    for (let asteroide of asteroides) {

        ctx.drawImage(
            asteroide.imagem,
            asteroide.x - asteroide.radius,
            asteroide.y - asteroide.radius,
            asteroide.radius * 2,
            asteroide.radius * 2
        );

    }

}

function moverNave() {

    nave.angle += nave.rotacao;

    
    nave.x += Math.cos(nave.angle) * nave.velocidade;
    nave.y += Math.sin(nave.angle) * nave.velocidade;

    
    if (nave.x < 0) {
        nave.x = 0; 
    } else if (nave.x > canvas.width) {
        nave.x = canvas.width; 
    }

    if (nave.y < 0) {
        nave.y = 0; 
    } else if (nave.y > canvas.height) {
        nave.y = canvas.height; 
    }


}

function moverTiros() {

    for (let i = nave.tiros.length - 1; i >= 0; i--) {

        let tiro = nave.tiros[i];

        tiro.x += tiro.dx;

        tiro.y += tiro.dy;

        if (tiro.x < 0 || tiro.x > canvas.width || tiro.y < 0 || tiro.y > canvas.height) {

            nave.tiros.splice(i, 1);

        }

    }

}

function moverAsteroides() {


    for (let asteroide of asteroides) {

        asteroide.x += asteroide.dx

        asteroide.y += asteroide.dy

        if (asteroide.x < 0) asteroide.x = canvas.width;

        if (asteroide.x > canvas.width) asteroide.x = 0;

        if (asteroide.y < 0) asteroide.y = canvas.height;

        if (asteroide.y > canvas.height) asteroide.y = 0;


    }

}
function detectarColisoes() {


    for (let i = nave.tiros.length-1; i >= 0; i--){
        
        let tiro = nave.tiros[i];

        for (let j = asteroides.length-1; j >=0; j--) {
            

            let asteroide  = asteroides[j];

            let dist = Math.hypot(tiro.x - asteroide.x,tiro.y-asteroide.y);

            if (dist<asteroide.radius) {

                pontuacao+=10
                
                document.getElementById("pontuacao").innerText=`Pontuação: ${pontuacao}`

                nave.tiros.splice(i,1);

                asteroides.splice(j,1);

                adicionarAsteroide();

                break;

                
            }
            
        }
       
    }

    for (let asteroide of asteroides) {
        
        let dist = Math.hypot(nave.x-asteroide.x, nave.y-asteroide.y);

        if (dist<asteroide.radius) {


            vidas--;

            document.getElementById("vidas").innerText=`Vidas: ${vidas}`;

            if (vidas<=0) {
                audio.currentTime = 0; 
                audio.pause(); 

                alert("Game Over!")

                document.location.reload();
                
            }

            asteroides.splice(asteroides.indexOf(asteroide),1);

            adicionarAsteroide();

            break;
            
        }
        
    }
    
}



function desenhar() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharNave();
    

    desenharTiros();

    desenharAsteroides();

    moverNave()
    
    moverTiros();

    moverAsteroides()

    detectarColisoes()

    requestAnimationFrame(desenhar)
}




iniciarMusica();
criarAsteroids();

setInterval(adicionarAsteroide, 5000);



desenhar();