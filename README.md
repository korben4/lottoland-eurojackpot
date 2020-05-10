# Eurojackpot viewer
Eurojackpot ex for Lottoland. See the lattest eurojackpot results. Made with Angular using Angular Material and Boostrap.

# Requirements
- You need a plugin to Allow CORS on Chrome to work locally: https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=es
- Need VPN: Tested with VPN targeting East Canada
- Transpiled to es2015

# What it does
- The main feature is to get and display the data from the service provided: https://media.lottoland.com/api/drawings/euroJackpot 
- I tried to be faithful with the original, but I did not work so much in the visual part and thats why it isn't functional and complete: I just want to show I can do it according to the oficial website, but I thought it was not necessary to work to improve the graphic part and yes for the part of programming.
- I know there are things which it's possible to made easier, but want to show difference ways and skills to do it.
- In the first version. I used promises and simple services for make it work.
- In the last version, I used Redux with NgRx to to the same with reducers, actions and effects.

# What else
- To make the ex a little more complete, I prepared some JSON test files to give functionality to the date combo. There are only two, for the dates of May 1 and April 3 and the data is fictitious.
- This feature only works running it as a local service.
- I put a button to show the next draw date.
