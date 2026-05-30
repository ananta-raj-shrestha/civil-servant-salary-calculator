
const RANKS=["Chief Secretary","Secretary","Joint Secretary","Under Secretary","Section Officer","Nayab Subba","Khardar","Mukhiya","NG Class IV","Classless"];
const SCALE_YEARS=[2017,2022,2030,2032,2033,2035,2038,2041,2042,2043,2045,2047,2049,2052,2054,2057,2062,2064,2065,2066,2068,2070,2071,2073,2075,2076,2078,2079];
const base={ "Chief Secretary":77211,"Secretary":72082,"Joint Secretary":56787,"Under Secretary":49380,"Section Officer":43689,"Nayab Subba":34730,"Khardar":32902,"Mukhiya":32010,"NG Class IV":24010,"Classless":23010};
const grade={"Chief Secretary":2574,"Secretary":2403,"Joint Secretary":1893,"Under Secretary":1646,"Section Officer":1457,"Nayab Subba":1158,"Khardar":1097,"Mukhiya":801,"NG Class IV":801,"Classless":767};
const caps={"Chief Secretary":2,"Secretary":2,"Joint Secretary":8,"Under Secretary":8,"Section Officer":8,"Nayab Subba":10,"Khardar":10,"Mukhiya":2,"NG Class IV":6,"Classless":5};
const mult={2017:0.0006,2022:0.0009,2030:0.0011,2032:0.0012,2033:0.0013,2035:0.0014,2038:0.0020,2041:0.0350,2042:0.0350,2043:0.0420,2045:0.0450,2047:0.0550,2049:0.0720,2052:0.0950,2054:0.1200,2057:0.1600,2062:0.2500,2064:0.3300,2065:0.3600,2066:0.4000,2068:0.4800,2070:0.5500,2071:0.6500,2073:0.8100,2075:0.8100,2076:0.9400,2078:0.9400,2079:1.0000};

function addRow(){
 let s=RANKS.map(x=>`<option>${x}</option>`).join("");
 document.querySelector("#tbl tbody").insertAdjacentHTML("beforeend",`<tr>
 <td><select class='form-select rank'>${s}</select></td>
 <td><input class='form-control sy' value='2054'></td>
 <td><input class='form-control sm' value='4'></td>
 <td><input class='form-control ey'></td>
 <td><input class='form-control em'></td>
 <td><button class='btn btn-danger' onclick='this.closest("tr").remove()'>X</button></td></tr>`);
}
function metrics(rank,year){
 let eff=2017; for(const y of SCALE_YEARS){if(y<=year) eff=y;}
 let m=mult[eff];
 if(eff<2033){
 const adj={
 "Chief Secretary":[900,50,6,0,0],"Secretary":[700,40,5,0,0],"Joint Secretary":[500,20,6,30,6],
 "Under Secretary":[450,20,6,30,6],"Section Officer":[275,12.5,8,15,7],"Nayab Subba":[175,7.5,10,10,5],
 "Khardar":[120,5,10,6,5],"Mukhiya":[75,3,10,4,5],"NG Class IV":[55,2,10,2.5,4],"Classless":[45,1,10,1.5,10]};
 let a=adj[rank], sf=m/0.0006;
 return [parseInt(a[0]*sf),parseInt(a[1]*sf),a[2],parseInt(a[3]*sf),a[4]];
 }
 return [parseInt(base[rank]*m),parseInt(grade[rank]*m),caps[rank],0,0];
}
function calculateSalary(){
 let rows=[...document.querySelectorAll("#tbl tbody tr")].map(r=>({
 rank:r.querySelector(".rank").value,
 sy:+r.querySelector(".sy").value, sm:+r.querySelector(".sm").value,
 ey:r.querySelector(".ey").value?+r.querySelector(".ey").value:null,
 em:r.querySelector(".em").value?+r.querySelector(".em").value:null
 }));
 rows.sort((a,b)=>(a.sy*12+a.sm)-(b.sy*12+b.sm));
 for(let i=0;i<rows.length-1;i++){
   let n=rows[i+1];
   rows[i].ey=n.sm===1?n.sy-1:n.sy;
   rows[i].em=n.sm===1?12:n.sm-1;
 }
 let grand=0, html="<table class='table'><tr><th>Rank</th><th>Window</th><th>Total</th></tr>";
 for(let row of rows){
   if(row.ey==null||row.em==null){alert("Last row needs end year/month"); return;}
   let payout=0,start=row.sy*12+row.sm;
   for(let y=row.sy;y<=row.ey;y++){
     let ms=y===row.sy?row.sm:1, me=y===row.ey?row.em:12;
     for(let m=ms;m<=me;m++){
       let elapsed=(y*12+m)-start;
       let yrs=Math.floor(elapsed/12);
       let [basic,r1,c1,r2,c2]=metrics(row.rank,y);
       let gp=r2>0?(yrs<=c1?yrs*r1:(c1*r1)+(Math.min(yrs-c1,c2)*r2)):Math.min(yrs,c1)*r1;
       let gross=basic+gp;
       if(m===6) gross*=2;
       payout+=gross;
     }
   }
   grand+=payout;
   html+=`<tr><td>${row.rank}</td><td>${row.sy}/${row.sm} - ${row.ey}/${row.em}</td><td>Rs ${payout.toLocaleString()}</td></tr>`;
 }
 html+=`</table><div class='alert alert-success'><b>Grand Total: Rs ${grand.toLocaleString()}</b></div>`;
 document.getElementById("out").innerHTML=html;
}
addRow();addRow();
