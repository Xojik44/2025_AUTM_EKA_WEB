function interactTeleport(tel, obj) {
  for (let i = 0; i < tel.length; i++) {
    let r =
      (pawn.x - tel[i][0]) ** 2 +
      (pawn.y - tel[i][1]) ** 2 +
      (pawn.z - tel[i][2]) ** 2;
    if (r < (tel[i][6] / 4) ** 2 + (tel[i][7] / 4) ** 2) {
      if (punkti == obj.length) {
        level++;
        teleportaSkana.play();
        if (level == spelesElementi.length) {
          // mansTeksts.innerHTML = "";
          // world.innerHTML = "";
          // myH1.textContent = "Spēle ir pabeigta, visi līmeņi ir izieti, nospied ESC lai izietu!";
          // mansTeksts.appendChild(myH1);
          // menuStart.style.display = "block";
          // canlock = false;
          level = 0;
          // clearInterval(timerGame);
          // continue;
        }
        punkti = 0;
        world.innerHTML = "";
        mansTeksts.innerHTML = "";
        pawn.x = 900;
        pawn.y = 0;
        pawn.z = 900;
        izvObj = structuredClone(spelesElementi[level][1]);
        createWorld(spelesElementi[level][0]);
        //zimetObjektus(spelesElementi[level][1], `objekts`);
        zimetObjektus(izvObj, `objekts`);
        zimetObjektus(spelesElementi[level][2], `teleports`);
        zimetLodi();
      } else {
        kludasSkana.play();
      }
    }
  }
}
