import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { supabase, cloudEnabled } from "./lib/supabase";
import { signUp, signIn, signOut, saveCloudAttempt, getLeaderboard } from "./lib/cloudData";

const categories = [
  { id: "programming", name: "Programming", icon: "⌘", tone: "violet", desc: "Code, logic & software", topics: ["JavaScript", "React", "Python", "Web Development"] },
  { id: "science", name: "Science", icon: "✳", tone: "mint", desc: "Discover how the world works", topics: ["Physics", "Biology", "Chemistry", "Astronomy"] },
  { id: "math", name: "Mathematics", icon: "∑", tone: "blue", desc: "Numbers, patterns & reasoning", topics: ["Arithmetic", "Algebra", "Geometry", "Logical Reasoning"] },
  { id: "knowledge", name: "General knowledge", icon: "◈", tone: "amber", desc: "People, places & big ideas", topics: ["Geography", "History", "World Facts", "Current Affairs"] },
  { id: "exams", name: "Education & exams", icon: "▤", tone: "pink", desc: "Prepare with purpose", topics: ["Aptitude", "Verbal Ability", "Engineering", "Competitive Exams"] },
  { id: "culture", name: "Sports & entertainment", icon: "♫", tone: "orange", desc: "The things we love", topics: ["Sports", "Movies", "Music", "Pop Culture"] },
];

const bank = [
  { category:"programming", topic:"JavaScript", difficulty:"Easy", question:"Which keyword declares a block-scoped variable that can be reassigned?", options:["const","let","static","define"], answer:1, explanation:"let declares a block-scoped variable that can be reassigned. Use const when the binding should not be reassigned." },
  { category:"programming", topic:"JavaScript", difficulty:"Medium", question:"What does Array.prototype.map() return?", options:["The original array, changed in place","A single number","A new array containing transformed items","Always a boolean"], answer:2, explanation:"map() creates a new array from the return value of the callback for each element." },
  { category:"programming", topic:"JavaScript", difficulty:"Easy", question:"Which value represents an intentional absence of a value in JavaScript?", options:["undefined only","null","NaN","false"], answer:1, explanation:"null is commonly used to intentionally represent no value. undefined often means a value has not been assigned." },
  { category:"programming", topic:"React", difficulty:"Easy", question:"Which React hook is commonly used to manage local component state?", options:["useRoute","useState","useStyle","useFetch"], answer:1, explanation:"useState adds a state variable to a function component and returns its current value and setter." },
  { category:"programming", topic:"React", difficulty:"Medium", question:"Why should a list of React elements usually have a stable key?", options:["To add CSS automatically","To help React identify items between renders","To make every item unique in the database","To prevent all rerenders"], answer:1, explanation:"Stable keys help React match list items across updates, making insertions, removals, and reordering more reliable." },
  { category:"programming", topic:"Python", difficulty:"Easy", question:"Which Python collection stores key-value pairs?", options:["list","tuple","dictionary","set"], answer:2, explanation:"A dictionary maps keys to values and is written using curly braces, for example {'name': 'Ava'}." },
  { category:"programming", topic:"Web Development", difficulty:"Easy", question:"What does CSS primarily control?", options:["Page structure","Visual presentation and layout","Server databases","Network routing"], answer:1, explanation:"CSS controls the presentation of documents, including colors, typography, spacing, and responsive layout." },
  { category:"science", topic:"Physics", difficulty:"Easy", question:"What is the SI unit of force?", options:["Joule","Watt","Newton","Pascal"], answer:2, explanation:"Force is measured in newtons (N). One newton accelerates one kilogram at one metre per second squared." },
  { category:"science", topic:"Biology", difficulty:"Easy", question:"Which organelle is best known as the cell's energy-producing powerhouse?", options:["Ribosome","Mitochondrion","Nucleus","Golgi apparatus"], answer:1, explanation:"Mitochondria generate much of the ATP used by eukaryotic cells." },
  { category:"science", topic:"Chemistry", difficulty:"Easy", question:"What is the chemical symbol for gold?", options:["Ag","Gd","Au","Go"], answer:2, explanation:"Gold's symbol is Au, from the Latin word aurum." },
  { category:"science", topic:"Astronomy", difficulty:"Easy", question:"Which planet is known for its prominent ring system?", options:["Mars","Saturn","Mercury","Venus"], answer:1, explanation:"Saturn has the most visually prominent ring system in our Solar System." },
  { category:"science", topic:"Physics", difficulty:"Medium", question:"Which quantity is measured in watts?", options:["Energy","Power","Electric charge","Pressure"], answer:1, explanation:"The watt is the SI unit of power, equal to one joule per second." },
  { category:"math", topic:"Arithmetic", difficulty:"Easy", question:"What is 15% of 200?", options:["15","20","30","35"], answer:2, explanation:"10% of 200 is 20 and 5% is 10, so 15% is 30." },
  { category:"math", topic:"Algebra", difficulty:"Easy", question:"If x + 7 = 19, what is x?", options:["10","11","12","13"], answer:2, explanation:"Subtract 7 from both sides: x = 19 − 7 = 12." },
  { category:"math", topic:"Geometry", difficulty:"Easy", question:"How many degrees are in the interior angles of a triangle?", options:["90°","180°","270°","360°"], answer:1, explanation:"The three interior angles of any Euclidean triangle add up to 180 degrees." },
  { category:"math", topic:"Logical Reasoning", difficulty:"Medium", question:"What comes next in the sequence 2, 6, 12, 20, 30, ...?", options:["36","40","42","44"], answer:2, explanation:"The differences are 4, 6, 8, 10, so the next difference is 12. The next term is 42." },
  { category:"knowledge", topic:"Geography", difficulty:"Easy", question:"Which is the largest ocean on Earth?", options:["Atlantic","Indian","Arctic","Pacific"], answer:3, explanation:"The Pacific Ocean is the largest and deepest ocean on Earth." },
  { category:"knowledge", topic:"History", difficulty:"Easy", question:"The ancient Olympic Games originated in which country?", options:["Italy","Greece","Egypt","China"], answer:1, explanation:"The ancient Olympic Games were held at Olympia in Greece." },
  { category:"knowledge", topic:"World Facts", difficulty:"Easy", question:"How many continents are commonly taught in the seven-continent model?", options:["Five","Six","Seven","Eight"], answer:2, explanation:"The seven-continent model includes Africa, Antarctica, Asia, Europe, North America, Australia, and South America." },
  { category:"knowledge", topic:"Geography", difficulty:"Medium", question:"Which imaginary line divides Earth into the Northern and Southern Hemispheres?", options:["Prime Meridian","Equator","Tropic of Cancer","International Date Line"], answer:1, explanation:"The Equator is at 0° latitude and divides Earth into Northern and Southern Hemispheres." },
  { category:"exams", topic:"Aptitude", difficulty:"Easy", question:"A train travels 120 km in 2 hours. What is its average speed?", options:["40 km/h","50 km/h","60 km/h","80 km/h"], answer:2, explanation:"Average speed = distance ÷ time = 120 ÷ 2 = 60 km/h." },
  { category:"exams", topic:"Verbal Ability", difficulty:"Easy", question:"Choose the closest meaning of 'concise'.", options:["Confusing","Brief and clear","Very loud","Uncertain"], answer:1, explanation:"Concise means giving information clearly in few words." },
  { category:"exams", topic:"Engineering", difficulty:"Medium", question:"Which logic gate outputs 1 only when all its inputs are 1?", options:["OR","XOR","AND","NOT"], answer:2, explanation:"An AND gate returns 1 only when every input is 1." },
  { category:"exams", topic:"Competitive Exams", difficulty:"Easy", question:"If a product costs ₹800 after a 20% discount, what was its original price?", options:["₹900","₹960","₹1,000","₹1,200"], answer:2, explanation:"₹800 is 80% of the original price. Original price = 800 ÷ 0.8 = ₹1,000." },
  { category:"culture", topic:"Sports", difficulty:"Easy", question:"How many players from one team are on the field in a standard football (soccer) match?", options:["9","10","11","12"], answer:2, explanation:"A standard football team fields 11 players, including the goalkeeper." },
  { category:"culture", topic:"Music", difficulty:"Easy", question:"Which family of instruments does a violin belong to?", options:["Brass","String","Percussion","Woodwind"], answer:1, explanation:"The violin is a bowed string instrument." },
  { category:"culture", topic:"Movies", difficulty:"Easy", question:"What does a film director primarily lead?", options:["The creative and dramatic realization of the film","Only ticket sales","Only the cinema building","The audience"], answer:0, explanation:"The director guides performances and the creative execution of a film." },
  { category:"culture", topic:"Sports", difficulty:"Medium", question:"In tennis, what is the score called when both players have 40 points?", options:["Match point","Deuce","Love","Advantage"], answer:1, explanation:"At 40–40, the score is called deuce; a player generally needs two consecutive points to win the game." },
];


// Additional practice questions to make mixed quizzes less repetitive.
bank.push(
  { category:"programming", topic:"Python", difficulty:"Medium", question:"What is the result of len([2, 4, 6])?", options:["2","3","4","6"], answer:1, explanation:"The list contains three elements, so len() returns 3." },
  { category:"programming", topic:"Web Development", difficulty:"Medium", question:"Which HTTP method is commonly used to retrieve a resource?", options:["POST","PATCH","GET","DELETE"], answer:2, explanation:"GET requests representation of a resource and should not be used to change server state." },
  { category:"programming", topic:"JavaScript", difficulty:"Medium", question:"Which operator checks both value and type equality?", options:["=","==","===","!==="], answer:2, explanation:"The strict equality operator === compares without type coercion." },
  { category:"programming", topic:"React", difficulty:"Medium", question:"What is the purpose of useEffect in React?", options:["Define CSS","Synchronize a component with external systems","Create HTML files","Replace all props"], answer:1, explanation:"useEffect runs side-effect logic such as subscriptions, timers, and synchronization after rendering." },
  { category:"science", topic:"Physics", difficulty:"Easy", question:"What is the approximate speed of light in vacuum?", options:["3 × 10⁶ m/s","3 × 10⁸ m/s","300 m/s","30,000 m/s"], answer:1, explanation:"Light travels at approximately 299,792,458 metres per second in vacuum." },
  { category:"science", topic:"Biology", difficulty:"Medium", question:"Which molecule carries genetic instructions in most living organisms?", options:["DNA","Glucose","ATP only","Cellulose"], answer:0, explanation:"DNA stores hereditary genetic information in most organisms." },
  { category:"science", topic:"Chemistry", difficulty:"Easy", question:"A solution with pH 3 is best described as what?", options:["Basic","Neutral","Acidic","A metal"], answer:2, explanation:"Values below pH 7 are acidic at standard reference conditions." },
  { category:"science", topic:"Astronomy", difficulty:"Medium", question:"What is the name of our galaxy?", options:["Andromeda","Milky Way","Whirlpool","Sombrero"], answer:1, explanation:"Our Solar System is located in the Milky Way galaxy." },
  { category:"math", topic:"Arithmetic", difficulty:"Easy", question:"What is 9 × 8?", options:["64","72","81","89"], answer:1, explanation:"Nine multiplied by eight equals seventy-two." },
  { category:"math", topic:"Algebra", difficulty:"Medium", question:"If 3x = 27, what is x?", options:["6","8","9","12"], answer:2, explanation:"Divide both sides by 3 to get x = 9." },
  { category:"math", topic:"Geometry", difficulty:"Medium", question:"What is the area of a rectangle 8 cm long and 3 cm wide?", options:["11 cm²","22 cm²","24 cm²","48 cm²"], answer:2, explanation:"Area of a rectangle is length × width: 8 × 3 = 24 cm²." },
  { category:"math", topic:"Logical Reasoning", difficulty:"Easy", question:"Which number does not belong: 4, 9, 16, 20, 25?", options:["4","9","20","25"], answer:2, explanation:"4, 9, 16, and 25 are perfect squares; 20 is not." },
  { category:"knowledge", topic:"Geography", difficulty:"Easy", question:"What is the capital of Japan?", options:["Kyoto","Seoul","Tokyo","Osaka"], answer:2, explanation:"Tokyo is Japan's capital and largest metropolitan area." },
  { category:"knowledge", topic:"History", difficulty:"Medium", question:"The printing press associated with Johannes Gutenberg developed in which century?", options:["12th","14th","15th","18th"], answer:2, explanation:"Gutenberg's movable-type printing press emerged in Europe around the mid-15th century." },
  { category:"knowledge", topic:"World Facts", difficulty:"Easy", question:"Which gas makes up the largest share of Earth's atmosphere?", options:["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"], answer:1, explanation:"Nitrogen accounts for roughly 78% of Earth's atmosphere." },
  { category:"exams", topic:"Aptitude", difficulty:"Medium", question:"A number increases from 80 to 100. What is the percentage increase?", options:["20%","25%","25%","30%"], answer:1, explanation:"The increase is 20. Divide by the original 80: 20/80 × 100 = 25%." },
  { category:"exams", topic:"Verbal Ability", difficulty:"Easy", question:"Choose the opposite of 'expand'.", options:["Enlarge","Extend","Contract","Increase"], answer:2, explanation:"Contract means to become smaller, the opposite of expand." },
  { category:"exams", topic:"Engineering", difficulty:"Medium", question:"What is the SI unit of electrical resistance?", options:["Volt","Ampere","Ohm","Coulomb"], answer:2, explanation:"Electrical resistance is measured in ohms (Ω)." },
  { category:"exams", topic:"Competitive Exams", difficulty:"Medium", question:"What is the average of 12, 18 and 24?", options:["16","18","20","22"], answer:1, explanation:"(12 + 18 + 24) ÷ 3 = 54 ÷ 3 = 18." },
  { category:"culture", topic:"Sports", difficulty:"Easy", question:"How many rings are on the Olympic symbol?", options:["Four","Five","Six","Seven"], answer:1, explanation:"The Olympic symbol has five interlocking rings." },
  { category:"culture", topic:"Music", difficulty:"Medium", question:"How many semitones are there in an octave in standard Western equal temperament?", options:["8","10","12","14"], answer:2, explanation:"An octave spans twelve semitones in standard Western equal temperament." },
  { category:"culture", topic:"Movies", difficulty:"Easy", question:"Which role is primarily responsible for assembling a film's shots into a sequence?", options:["Editor","Costume designer","Casting director","Location scout"], answer:0, explanation:"The film editor selects and assembles footage to shape the final sequence and pacing." },
  { category:"programming", topic:"Python", difficulty:"Easy", question:"Which symbol starts a single-line comment in Python?", options:["//","#","<!--","**"], answer:1, explanation:"Python uses # to begin a single-line comment." },
  { category:"science", topic:"Physics", difficulty:"Medium", question:"Which law states that every action has an equal and opposite reaction?", options:["Newton's first law","Newton's second law","Newton's third law","Ohm's law"], answer:2, explanation:"Newton's third law describes equal and opposite forces between interacting bodies." },
  { category:"math", topic:"Arithmetic", difficulty:"Medium", question:"What is 3/4 expressed as a percentage?", options:["25%","50%","75%","80%"], answer:2, explanation:"3 divided by 4 is 0.75, which is 75%." },
  { category:"knowledge", topic:"Geography", difficulty:"Medium", question:"Which is the smallest continent by land area in the seven-continent model?", options:["Europe","Antarctica","Australia","South America"], answer:2, explanation:"Australia is the smallest continent by land area in the seven-continent model." },
  { category:"exams", topic:"Aptitude", difficulty:"Easy", question:"If 5 pens cost ₹60, what is the cost of one pen?", options:["₹10","₹12","₹15","₹20"], answer:1, explanation:"₹60 divided by 5 pens is ₹12 per pen." },
  { category:"culture", topic:"Sports", difficulty:"Medium", question:"In cricket, how many legal deliveries are in a standard over?", options:["4","5","6","8"], answer:2, explanation:"A standard over consists of six legal deliveries." }
);


// Quiz Verse 3.0 expanded practice bank
bank.push(
 {category:"programming",topic:"JavaScript",difficulty:"Easy",question:"Which method converts a JSON string into a JavaScript value?",options:["JSON.stringify()","JSON.parse()","JSON.convert()","JSON.read()"],answer:1,explanation:"JSON.parse() reads a JSON string and produces the corresponding JavaScript value."},
 {category:"programming",topic:"JavaScript",difficulty:"Medium",question:"What does the spread syntax ... do with an array in an array literal?",options:["Sorts it","Expands its elements","Deletes duplicates","Freezes it"],answer:1,explanation:"Spread syntax expands an iterable's elements into the surrounding array or argument list."},
 {category:"programming",topic:"Python",difficulty:"Easy",question:"Which keyword defines a function in Python?",options:["func","function","def","lambda"],answer:2,explanation:"The def keyword starts a standard named function definition in Python."},
 {category:"programming",topic:"Python",difficulty:"Medium",question:"What does a Python set primarily store?",options:["Only ordered duplicates","Unique elements","Key-value pairs only","Characters only"],answer:1,explanation:"A set stores unique hashable elements and is useful for membership tests and removing duplicates."},
 {category:"programming",topic:"React",difficulty:"Easy",question:"What syntax is commonly used to embed JavaScript expressions in JSX?",options:["{{ }}","[ ]","{ }","<% %>"],answer:2,explanation:"JSX uses curly braces to embed JavaScript expressions in markup."},
 {category:"programming",topic:"Web Development",difficulty:"Easy",question:"Which HTML element creates a hyperlink?",options:["<link>","<a>","<href>","<url>"],answer:1,explanation:"The anchor element <a> creates a hyperlink, typically using its href attribute."},
 {category:"programming",topic:"Web Development",difficulty:"Medium",question:"What does HTTP status code 404 indicate?",options:["Success","Unauthorized","Resource not found","Server overloaded"],answer:2,explanation:"HTTP 404 means the server could not find the requested resource."},
 {category:"science",topic:"Physics",difficulty:"Easy",question:"What is the SI unit of electric current?",options:["Volt","Ampere","Ohm","Watt"],answer:1,explanation:"Electric current is measured in amperes (A)."},
 {category:"science",topic:"Physics",difficulty:"Medium",question:"Which energy does a moving object possess?",options:["Kinetic","Chemical","Nuclear","Rest only"],answer:0,explanation:"Kinetic energy is the energy associated with motion."},
 {category:"science",topic:"Biology",difficulty:"Easy",question:"Which part of a plant mainly absorbs water from soil?",options:["Flower","Roots","Fruit","Stem tip"],answer:1,explanation:"Root systems absorb water and dissolved minerals from the soil."},
 {category:"science",topic:"Biology",difficulty:"Medium",question:"Which blood cells primarily help fight infections?",options:["Red blood cells","White blood cells","Platelets","Plasma proteins only"],answer:1,explanation:"White blood cells are key components of the immune system."},
 {category:"science",topic:"Chemistry",difficulty:"Easy",question:"What is the chemical formula for water?",options:["CO2","O2","H2O","NaCl"],answer:2,explanation:"A water molecule contains two hydrogen atoms bonded to one oxygen atom."},
 {category:"science",topic:"Chemistry",difficulty:"Medium",question:"What is the pH of a neutral aqueous solution at about 25°C?",options:["0","5","7","14"],answer:2,explanation:"At approximately 25°C, a neutral aqueous solution has pH 7."},
 {category:"science",topic:"Astronomy",difficulty:"Easy",question:"Which star is closest to Earth?",options:["Sirius","The Sun","Polaris","Proxima Centauri"],answer:1,explanation:"The Sun is Earth's nearest star."},
 {category:"science",topic:"Astronomy",difficulty:"Medium",question:"What force keeps planets in orbit around the Sun?",options:["Friction","Magnetism alone","Gravity","Air pressure"],answer:2,explanation:"The Sun's gravitational attraction governs the planets' orbits."},
 {category:"math",topic:"Arithmetic",difficulty:"Easy",question:"What is 25% of 360?",options:["45","80","90","120"],answer:2,explanation:"One quarter of 360 is 90, so 25% equals 90."},
 {category:"math",topic:"Arithmetic",difficulty:"Medium",question:"A price of ₹500 rises by 10%. What is the new price?",options:["₹510","₹525","₹550","₹600"],answer:2,explanation:"Ten percent of ₹500 is ₹50, giving a new price of ₹550."},
 {category:"math",topic:"Algebra",difficulty:"Easy",question:"Solve: 2x + 6 = 20.",options:["5","6","7","8"],answer:2,explanation:"Subtract 6 to get 2x = 14, then divide by 2: x = 7."},
 {category:"math",topic:"Algebra",difficulty:"Medium",question:"What is (a + b)² equal to?",options:["a² + b²","a² + 2ab + b²","2a + 2b","a² - 2ab + b²"],answer:1,explanation:"Expanding (a+b)(a+b) gives a² + 2ab + b²."},
 {category:"math",topic:"Geometry",difficulty:"Easy",question:"How many sides does a hexagon have?",options:["Five","Six","Seven","Eight"],answer:1,explanation:"A hexagon is a polygon with six sides."},
 {category:"math",topic:"Geometry",difficulty:"Medium",question:"What is the circumference of a circle with radius r?",options:["πr²","2πr","πr","4πr²"],answer:1,explanation:"Circumference is the distance around a circle and equals 2πr."},
 {category:"math",topic:"Logical Reasoning",difficulty:"Easy",question:"Find the next number: 3, 6, 12, 24, ...",options:["30","36","42","48"],answer:3,explanation:"Each term doubles, so 24 × 2 = 48."},
 {category:"knowledge",topic:"Geography",difficulty:"Easy",question:"Which is the largest country by land area?",options:["Canada","China","Russia","United States"],answer:2,explanation:"Russia is the world's largest country by total area."},
 {category:"knowledge",topic:"Geography",difficulty:"Medium",question:"Which river flows through Egypt and into the Mediterranean Sea?",options:["Amazon","Nile","Danube","Mekong"],answer:1,explanation:"The Nile flows north through Egypt and enters the Mediterranean Sea."},
 {category:"knowledge",topic:"History",difficulty:"Easy",question:"Who was the first person to walk on the Moon?",options:["Yuri Gagarin","Neil Armstrong","Buzz Aldrin","John Glenn"],answer:1,explanation:"Neil Armstrong stepped onto the Moon during Apollo 11 in July 1969."},
 {category:"knowledge",topic:"World Facts",difficulty:"Easy",question:"What is the largest mammal on Earth?",options:["African elephant","Blue whale","Giraffe","Orca"],answer:1,explanation:"The blue whale is the largest known animal to have lived on Earth."},
 {category:"exams",topic:"Aptitude",difficulty:"Easy",question:"A person completes 60 km in 1.5 hours. What is the average speed?",options:["30 km/h","40 km/h","45 km/h","90 km/h"],answer:1,explanation:"Average speed = distance/time = 60/1.5 = 40 km/h."},
 {category:"exams",topic:"Aptitude",difficulty:"Medium",question:"The ratio of 24 to 36 in simplest form is:",options:["2:3","3:2","4:5","6:9"],answer:0,explanation:"Divide both terms by their greatest common divisor, 12, to get 2:3."},
 {category:"exams",topic:"Verbal Ability",difficulty:"Easy",question:"Choose the correctly spelled word.",options:["Accomodate","Acommodate","Accommodate","Acomodate"],answer:2,explanation:"The correct spelling is accommodate, with double c and double m."},
 {category:"exams",topic:"Engineering",difficulty:"Easy",question:"What is the binary representation of decimal 2?",options:["01","10","11","100"],answer:1,explanation:"Decimal 2 is binary 10 because it contains one 2¹ and zero 2⁰."},
 {category:"exams",topic:"Competitive Exams",difficulty:"Medium",question:"If 8 workers finish a job in 6 days at the same rate, how many worker-days is the job?",options:["14","24","36","48"],answer:3,explanation:"Total work is 8 × 6 = 48 worker-days."},
 {category:"culture",topic:"Sports",difficulty:"Easy",question:"How many points is a successful shot from beyond the arc worth in basketball?",options:["1","2","3","4"],answer:2,explanation:"A made field goal from beyond the three-point line is worth three points."},
 {category:"culture",topic:"Sports",difficulty:"Medium",question:"In cricket, what does LBW stand for?",options:["Long Bat Win","Leg Before Wicket","Last Ball Wide","Line Beyond Wicket"],answer:1,explanation:"LBW stands for leg before wicket, a method of dismissal under cricket's laws."},
 {category:"culture",topic:"Music",difficulty:"Easy",question:"Which instrument typically has 88 keys on a standard modern model?",options:["Violin","Flute","Piano","Trumpet"],answer:2,explanation:"A standard full-size piano keyboard has 88 keys."},
 {category:"culture",topic:"Movies",difficulty:"Medium",question:"What is a screenplay?",options:["A film's written script","A camera lens","A cinema ticket","A soundtrack format"],answer:0,explanation:"A screenplay is the written blueprint for a film, including dialogue and action."}
);

const iconFor = (name) => ({ Programming:"⌘", Science:"✳", Mathematics:"∑", "General knowledge":"◈", "Education & exams":"▤", "Sports & entertainment":"♫" }[name] || "✦");

export default function App() {
  const [view, setView] = useState("home");
  const [category, setCategory] = useState("all");
  const [topic, setTopic] = useState("All topics");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All levels");
  const [questionCount, setQuestionCount] = useState("10");
  const [timed, setTimed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [seconds, setSeconds] = useState(30);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("qv-player-name") || "Khadar");
  const [profileDraft, setProfileDraft] = useState(() => localStorage.getItem("qv-player-name") || "Khadar");
  const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem("qv-history") || "[]"); } catch { return []; } });
  const [leaderboard, setLeaderboard] = useState(() => { try { return JSON.parse(localStorage.getItem("qv-leaderboard") || "[]"); } catch { return []; } });
  const [quizStartedAt, setQuizStartedAt] = useState(0);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [cloudNotice, setCloudNotice] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => subscription.unsubscribe();
  }, []);

  async function handleAuthSubmit(event) {
    event.preventDefault(); setAuthBusy(true); setAuthMessage("");
    try {
      if (authMode === "signup") {
        const result = await signUp(authEmail.trim(), authPassword, authName.trim() || "Player");
        setAuthMessage(result.session ? "Account created and signed in." : "Account created. Check your email to confirm, then sign in.");
        if (result.session) setView("profile");
      } else {
        await signIn(authEmail.trim(), authPassword); setAuthMessage("Signed in successfully."); setView("profile");
      }
    } catch (error) { setAuthMessage(error.message || "Authentication failed. Check your details and try again."); }
    finally { setAuthBusy(false); }
  }

  async function refreshCloudLeaderboard() {
    try {
      const rows = await getLeaderboard();
      if (rows.length) setLeaderboard(rows.map((row, index) => ({ id: row.user_id || index, name: row.display_name || "Player", topic: "All topics", category: "Quiz Verse", score: row.best_score || 0, total: 100, accuracy: Math.round(row.average_score || 0) })));
    } catch (error) { console.error("Could not load cloud leaderboard:", error); setCloudNotice(`Could not load leaderboard: ${error.message}`); }
  }

  const available = useMemo(() => bank.filter(q =>
    (category === "all" || q.category === category) &&
    (topic === "All topics" || q.topic === topic) &&
    (difficulty === "All levels" || q.difficulty === difficulty)
  ), [category, topic, difficulty]);
  const filteredCategories = categories.filter(c => {
    const haystack = `${c.name} ${c.desc} ${c.topics.join(" ")}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });
  const currentQuestion = questions[current];
  const score = answers.filter(a => a.correct).length;
  const categoryName = categories.find(c => c.id === category)?.name || "Explore all categories";

  // A real per-question countdown. The interval pauses while the answer explanation is shown.
  useEffect(() => {
    if (view !== "quiz" || !timed || submitted) return;
    if (seconds <= 0) {
      setAnswers(prev => [...prev, { question: currentQuestion, selected: null, correct: false, timedOut: true }]);
      setSubmitted(true);
      return;
    }
    const timerId = window.setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => window.clearTimeout(timerId);
  }, [view, timed, submitted, seconds, current, currentQuestion]);

  function persistResults(finalAnswers) {
    const correctCount = finalAnswers.filter(a => a.correct).length;
    const result = { id: Date.now(), name: playerName, date: new Date().toISOString(), category: categoryName, topic, total: questions.length, score: correctCount, accuracy: Math.round(correctCount / Math.max(questions.length, 1) * 100), duration: Math.max(0, Math.round((Date.now() - quizStartedAt) / 1000)) };
    const nextHistory = [result, ...history].slice(0, 100);
    const nextBoard = [...leaderboard.filter(item => item.id !== result.id), result].sort((a,b) => b.score - a.score || b.accuracy - a.accuracy).slice(0, 20);
    setHistory(nextHistory); setLeaderboard(nextBoard);
    localStorage.setItem("qv-history", JSON.stringify(nextHistory));
    localStorage.setItem("qv-leaderboard", JSON.stringify(nextBoard));
    if (cloudEnabled && session?.user) {
      saveCloudAttempt({ category: categoryName, topic, difficulty, total: questions.length, score: correctCount, duration: result.duration })
        .then(() => setCloudNotice("Quiz result saved to your account."))
        .catch((error) => setCloudNotice(`Cloud save failed: ${error.message}`));
    } else if (cloudEnabled) setCloudNotice("Quiz saved on this device. Sign in to sync results to the cloud.");
  }

  // A real per-question countdown. The interval pauses while the answer explanation is shown.
  useEffect(() => {
    if (view !== "quiz" || !timed || submitted) return;
    if (seconds <= 0) {
      setAnswers(prev => [...prev, { question: currentQuestion, selected: null, correct: false, timedOut: true }]);
      setSubmitted(true);
      return;
    }
    const timerId = window.setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => window.clearTimeout(timerId);
  }, [view, timed, submitted, seconds, current, currentQuestion]);

  function persistResults(finalAnswers) {
    const correctCount = finalAnswers.filter(a => a.correct).length;
    const result = { id: Date.now(), name: playerName, date: new Date().toISOString(), category: categoryName, topic, total: questions.length, score: correctCount, accuracy: Math.round(correctCount / Math.max(questions.length, 1) * 100), duration: Math.max(0, Math.round((Date.now() - quizStartedAt) / 1000)) };
    const nextHistory = [result, ...history].slice(0, 100);
    const nextBoard = [...leaderboard.filter(item => item.id !== result.id), result].sort((a,b) => b.score - a.score || b.accuracy - a.accuracy).slice(0, 20);
    setHistory(nextHistory); setLeaderboard(nextBoard);
    localStorage.setItem("qv-history", JSON.stringify(nextHistory));
    localStorage.setItem("qv-leaderboard", JSON.stringify(nextBoard));
  }

  function startQuiz() {
    const pool = [...available].sort(() => Math.random() - 0.5);
    const count = Math.min(Number(questionCount), pool.length);
    if (!count) return;
    setQuestions(pool.slice(0, count));
    setCurrent(0); setSelected(null); setSubmitted(false); setAnswers([]); setSeconds(30); setQuizStartedAt(Date.now());
    setView("quiz");
  }
  function recordAnswer() {
    if (selected === null || submitted) return;
    setAnswers(prev => [...prev, { question: currentQuestion, selected, correct: selected === currentQuestion.answer }]);
    setSubmitted(true);
  }
  function nextQuestion() {
    if (current === questions.length - 1) { persistResults(answers); setView("results"); }
    else { setCurrent(v => v + 1); setSelected(null); setSubmitted(false); setSeconds(30); }
  }
  function resetHome() {
    setView("home"); setSelected(null); setSubmitted(false); setAnswers([]); setCurrent(0);
  }

  return <div className="app">
    <header className="topbar">
      <button className="brand" onClick={resetHome} aria-label="Quiz Verse home"><span className="brand-mark">q<span>.</span></span><span>Quiz Verse</span></button>
      <nav className="nav-links"><button onClick={resetHome} className={view === "home" ? "active" : ""}>Discover</button><button onClick={() => setView("setup")}>Quick quiz</button><button onClick={() => setView("history")}>History</button><button onClick={() => setView("leaderboard")}>Leaderboard</button><a href="#categories" onClick={() => { setView("home"); setTimeout(() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }), 0); }}>Categories</a></nav>
      <div className="top-actions"><span className="status-dot" /> <span className="top-label">YOUR DAILY DOSE OF CURIOSITY</span>{cloudEnabled && (session ? <button className="button-secondary account-button" onClick={async () => { await signOut(); setCloudNotice("Signed out."); }}>Sign out</button> : <button className="button-secondary account-button" onClick={() => { setAuthMessage(""); setView("auth"); }}>Sign in</button>)}<button className="avatar" title="Your profile" onClick={() => { setProfileDraft(playerName); setView("profile"); }}>{(playerName.trim()[0] || "K").toUpperCase()}</button></div>
      <div className="mobile-account-action">{cloudEnabled && (session ? <button className="button-secondary account-button" onClick={async () => { await signOut(); setCloudNotice("Signed out."); }}>Sign out</button> : <button className="button-secondary account-button" onClick={() => { setAuthMessage(""); setView("auth"); }}>Sign in</button>)}</div>
    </header>

    {view === "home" && <>
      <main className="main-content">
        <section className="hero universe-hero">
          <div className="universe-copy">
            <div className="kicker"><span className="spark">✦</span> YOUR CURIOSITY HAS NO GRAVITY</div>
            <h1>Enter the<br /><span>Quiz Verse.</span></h1>
            <p className="hero-description">Six worlds to explore. Thousands of things to discover. One curious mind to power it all.</p>
            <div className="hero-buttons"><button className="button-primary" onClick={() => setView("setup")}>Launch a challenge <span>↗</span></button><a href="#categories" className="button-quiet">Choose your world <span>↓</span></a></div>
            <div className="universe-coordinates"><span>Q / 001</span><i></i><span>DISCOVER · PLAY · EVOLVE</span></div>
          </div>
          <div className="universe-scene" aria-label="Interactive constellation of quiz categories">
            <div className="scene-grid"></div>
            <div className="scene-nebula nebula-one"></div><div className="scene-nebula nebula-two"></div>
            <div className="scene-orbit orbit-a"></div><div className="scene-orbit orbit-b"></div><div className="scene-orbit orbit-c"></div>
            <button className="world world-core" onClick={() => setView("setup")} aria-label="Launch a mixed quiz"><span className="core-label">Q</span><span className="world-caption">QUIZ VERSE</span></button>
            <button className="world world-code" onClick={() => {setCategory("programming");setTopic("All topics");setView("setup");}}><span className="world-glyph">⌘</span><span className="world-name">CODE</span></button>
            <button className="world world-science" onClick={() => {setCategory("science");setTopic("All topics");setView("setup");}}><span className="world-glyph">✳</span><span className="world-name">SCIENCE</span></button>
            <button className="world world-math" onClick={() => {setCategory("math");setTopic("All topics");setView("setup");}}><span className="world-glyph">∑</span><span className="world-name">MATH</span></button>
            <button className="world world-culture" onClick={() => {setCategory("culture");setTopic("All topics");setView("setup");}}><span className="world-glyph">♫</span><span className="world-name">CULTURE</span></button>
            <span className="scene-coordinate coord-one">N 07° / LOGIC</span><span className="scene-coordinate coord-two">SIGNAL FOUND ✦</span>
            <div className="scene-bottom"><span>SELECT A WORLD</span><span>06 SECTORS DETECTED</span></div>
          </div>
          <div className="hero-bottom-note"><span>01 / THE EXPLORATION BEGINS</span><span>NO MAP. JUST CURIOSITY <b>↘</b></span></div>
        </section>

        <section className="quick-stats">
          <div><strong>06</strong><span>CORE CATEGORIES</span></div><i /><div><strong>{bank.length.toString().padStart(2,"0")}+</strong><span>QUESTION BANK</span></div><i /><div><strong>∞</strong><span>WAYS TO GET CURIOUS</span></div>
          <p>A little challenge goes a long way. <span>✦</span></p>
        </section>

        <section className="category-section" id="categories">
          <div className="section-heading"><div><div className="kicker">YOUR WORLD, YOUR RULES</div><h2>What are we <span>curious about?</span></h2><p>Choose a universe to explore. There’s always something new to learn.</p></div><div className="search-wrap"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a subject..." aria-label="Search categories and subjects" />{search && <button onClick={() => setSearch("")}>×</button>}</div></div>
          <div className="category-grid">
            {filteredCategories.map((c, i) => <button key={c.id} className={`category-card ${c.tone}`} onClick={() => { setCategory(c.id); setTopic("All topics"); setView("setup"); }}>
              <div className="category-top"><span className="category-icon">{c.icon}</span><span className="card-index">0{i+1}</span></div>
              <h3>{c.name}</h3><p>{c.desc}</p><div className="topic-tags">{c.topics.slice(0,3).map(t => <span key={t}>{t}</span>)}</div><div className="category-bottom"><span>EXPLORE CATEGORY</span><span className="round-arrow">↗</span></div>
            </button>)}
          </div>
          {filteredCategories.length === 0 && <div className="empty-state">No subjects match “{search}”. Try another search.</div>}
        </section>

        <section className="featured">
          <div className="featured-copy"><div className="kicker">A SMALL CHALLENGE, A BIG WIN</div><h2>Make five minutes<br />count.</h2><p>Build a quick quiz around your interests. Choose a topic and difficulty, then see what sticks.</p><button className="button-primary" onClick={() => setView("setup")}>Create a quick quiz <span>↗</span></button></div>
          <div className="featured-visual"><div className="feature-circle circle-back" /><div className="feature-circle circle-front"><span>Q</span><small>YOUR NEXT CHALLENGE</small></div><div className="feature-sticker">NO PRESSURE.<br /><b>JUST PROGRESS.</b></div><div className="feature-number">01—06</div></div>
        </section>
      </main>
      <footer className="footer"><button className="brand footer-brand" onClick={resetHome}><span className="brand-mark">q<span>.</span></span><span>Quiz Verse</span></button><span>Built for the endlessly curious.</span><span>LEARN · PLAY · REPEAT</span></footer>
    </>}

    {view === "auth" && <main className="setup-page extra-page">
      <button className="back-link" onClick={resetHome}>← Back to discover</button>
      <div className="setup-heading"><div className="kicker">YOUR QUIZ VERSE ACCOUNT</div><h1>{authMode === "signup" ? "Join the " : "Welcome to the "}<span>Verse.</span></h1><p>Sign in to sync quiz results and use your account across devices.</p></div>
      <form className="setup-panel extra-panel" onSubmit={handleAuthSubmit}>
        {!cloudEnabled && <p className="field-hint">Cloud credentials are not configured. Check your .env.local file.</p>}
        <div className="field-block"><label>EMAIL ADDRESS</label><input className="profile-input" type="email" autoComplete="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com" /></div>
        {authMode === "signup" && <div className="field-block"><label>DISPLAY NAME</label><input className="profile-input" required maxLength={32} value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Your name" /></div>}
        <div className="field-block"><label>PASSWORD</label><input className="profile-input" type="password" autoComplete={authMode === "signup" ? "new-password" : "current-password"} minLength={6} required value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="At least 6 characters" /></div>
        <button className="button-primary" type="submit" disabled={!cloudEnabled || authBusy}>{authBusy ? "Please wait…" : authMode === "signup" ? "Create account" : "Sign in"} <span>↗</span></button>
        <button type="button" className="button-secondary" onClick={() => { setAuthMode(authMode === "signup" ? "signin" : "signup"); setAuthMessage(""); }}>{authMode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}</button>
        {authMessage && <p className="field-hint" role="status">{authMessage}</p>}
      </form>
    </main>}

    {view === "setup" && <main className="setup-page">
      <button className="back-link" onClick={resetHome}>← Back to discover</button>
      <div className="setup-heading"><div className="kicker">MAKE IT YOURS</div><h1>Build your <span>challenge.</span></h1><p>A good quiz meets you where you are, then nudges you a little further.</p></div>
      <div className="setup-layout"><section className="setup-panel">
        <div className="field-block"><label>01 / PICK A CATEGORY</label><div className="choice-grid category-choices"><button className={category === "all" ? "choice selected" : "choice"} onClick={() => {setCategory("all");setTopic("All topics");}}>✦ <span>All categories</span></button>{categories.map(c => <button key={c.id} className={category === c.id ? "choice selected" : "choice"} onClick={() => {setCategory(c.id);setTopic("All topics");}}><span className={`choice-symbol ${c.tone}`}>{c.icon}</span><span>{c.name}</span></button>)}</div></div>
        <div className="field-block"><label>02 / CHOOSE A TOPIC</label><select value={topic} onChange={e => setTopic(e.target.value)}><option>All topics</option>{categories.filter(c => category === "all" || c.id === category).flatMap(c => c.topics).map(t => <option key={t}>{t}</option>)}</select></div>
        <div className="field-block"><label>03 / SET YOUR LEVEL</label><div className="choice-grid level-choices">{["All levels","Easy","Medium","Hard"].map((d,i) => <button key={d} className={difficulty === d ? "level-choice selected" : "level-choice"} onClick={() => setDifficulty(d)}><span>{["✦","●","◆","▲"][i]}</span>{d}</button>)}</div></div>
        <div className="field-block"><label>04 / HOW MANY QUESTIONS?</label><div className="choice-grid count-choices">{["5","10","15","25"].map(n => <button key={n} className={questionCount === n ? "level-choice selected" : "level-choice"} onClick={() => setQuestionCount(n)}>{n} <small>Q</small></button>)}</div><p className="field-hint">We’ll use up to {available.length} matching questions from the expanded question bank.</p></div>
        <div className="field-block timer-row"><div><label>OPTIONAL / TIME YOURSELF</label><p>Challenge yourself with a little clock pressure.</p></div><button className={`toggle ${timed ? "on" : ""}`} onClick={() => setTimed(v => !v)} aria-pressed={timed}><span /></button></div>
      </section>
      <aside className="preview-panel"><div className="preview-top"><span>YOUR QUIZ</span><span className="preview-live"><i /> READY TO BUILD</span></div><div className="preview-art"><div className="preview-orb">q<span>.</span></div><span className="preview-star star-one">✦</span><span className="preview-star star-two">✧</span></div><div className="preview-content"><div className="preview-kicker">{category === "all" ? "MIXED EXPLORATION" : categoryName.toUpperCase()}</div><h2>{topic === "All topics" ? "A little bit of everything." : `${topic}, but make it a challenge.`}</h2><p>Questions selected for your chosen subject and level.</p><div className="preview-facts"><div><strong>{Math.min(Number(questionCount), available.length)}</strong><span>QUESTIONS</span></div><div><strong>{difficulty === "All levels" ? "Mixed" : difficulty}</strong><span>DIFFICULTY</span></div><div><strong>{timed ? "On" : "Off"}</strong><span>TIMER</span></div></div>{available.length === 0 && <p className="availability-warning">No questions match this combination yet. Try All levels or another topic.</p>}<button className="button-primary launch-button" disabled={!available.length} onClick={startQuiz}>Start your quiz <span>↗</span></button><small className="preview-note">No pressure. Every answer is progress.</small></div></aside></div>
    </main>}

    {view === "quiz" && currentQuestion && <main className="play-page">
      <div className="play-top"><button className="back-link" onClick={resetHome}>← Leave quiz</button><div className="play-brand"><span className="brand-mark">q<span>.</span></span> QUIZ VERSE <span className="play-divider">/</span> PRACTICE MODE</div><div className="timer-chip">{timed ? `◷ 00:${String(seconds).padStart(2,"0")}` : "✦ TAKE YOUR TIME"}</div></div>
      <div className="play-progress"><div style={{width:`${((current + (submitted ? 1 : 0))/questions.length)*100}%`}} /></div>
      <div className="play-layout"><section className="play-main"><div className="play-meta"><span>{currentQuestion.topic.toUpperCase()}</span><span>{currentQuestion.difficulty.toUpperCase()} LEVEL</span></div><div className="question-number">QUESTION <strong>{String(current+1).padStart(2,"0")}</strong><span> / {String(questions.length).padStart(2,"0")}</span></div><h1>{currentQuestion.question}</h1><p className="play-instruction">Choose the best answer. Trust what you know, then learn what you don’t.</p><div className="play-options">{currentQuestion.options.map((option,i)=>{const isCorrect=submitted&&i===currentQuestion.answer;const isWrong=submitted&&selected===i&&i!==currentQuestion.answer;return <button key={option} disabled={submitted} className={`play-option ${selected===i?"chosen":""} ${isCorrect?"is-correct":""} ${isWrong?"is-wrong":""}`} onClick={()=>setSelected(i)}><span className="option-key">{String.fromCharCode(65+i)}</span><span>{option}</span><span className="option-result">{isCorrect?"✓":isWrong?"×":selected===i?"●":""}</span></button>})}</div>{submitted&&<div className={`explanation ${selected===currentQuestion.answer?"right":"wrong"}`}><strong>{selected===currentQuestion.answer?"✓ Exactly right!":selected===null?"⌛ Time is up":"↗ Good chance to learn"}</strong><p>{currentQuestion.explanation}</p></div>}<div className="play-actions"><span>{submitted?"Answer saved. Keep your momentum.":"One answer. One step forward."}</span>{!submitted?<button className="button-primary" disabled={selected===null} onClick={recordAnswer}>Lock in answer <span>↗</span></button>:<button className="button-primary" onClick={nextQuestion}>{current===questions.length-1?"See your results":"Next question"} <span>→</span></button>}</div></section><aside className="play-aside"><div className="aside-progress"><div className="aside-icon">✦</div><span>YOUR MOMENTUM</span><h3>Curiosity in motion.</h3><p>Progress isn't about knowing everything. It's about staying in the game.</p><div className="aside-divider" /><div className="aside-stat"><span>Answered</span><strong>{answers.length} / {questions.length}</strong></div><div className="aside-stat"><span>Correct so far</span><strong>{score}</strong></div><div className="aside-stat"><span>Accuracy</span><strong>{answers.length?Math.round(score/answers.length*100):0}%</strong></div></div><div className="aside-quote">“The beautiful thing about learning is nobody can take it away from you.”<small>KEEP GOING ↗</small></div></aside></div>
    </main>}

    {view === "profile" && <main className="setup-page extra-page"><button className="back-link" onClick={resetHome}>← Back to discover</button><div className="setup-heading"><div className="kicker">YOUR SPACE</div><h1>Player <span>profile.</span></h1><p>{session ? `Signed in as ${session.user.email}. Your cloud account is active.` : "Your name and quiz progress are saved in this browser on this device."}</p></div><section className="setup-panel extra-panel"><div className="field-block"><label>DISPLAY NAME</label><input className="profile-input" value={profileDraft} maxLength={32} onChange={e => setProfileDraft(e.target.value)} placeholder="Enter your name" /></div><div className="field-block"><label>YOUR STATS</label><div className="profile-stats"><div><strong>{history.length}</strong><span>QUIZZES</span></div><div><strong>{history.reduce((sum,item)=>sum+item.score,0)}</strong><span>POINTS</span></div><div><strong>{history.length ? Math.round(history.reduce((sum,item)=>sum+item.accuracy,0)/history.length) : 0}%</strong><span>AVG. ACCURACY</span></div></div></div><button className="button-primary" onClick={() => { const name = profileDraft.trim() || "Player"; setPlayerName(name); localStorage.setItem("qv-player-name", name); setView("home"); }}>Save profile <span>↗</span></button><p className="field-hint">{session ? "Your account is connected. Quiz attempts can sync to Supabase." : "This is a local profile. Sign in to enable cloud syncing."}</p>{cloudNotice && <p className="field-hint" role="status">{cloudNotice}</p>}{cloudEnabled && !session && <button className="button-secondary" onClick={() => { setAuthMode("signin"); setView("auth"); }}>Sign in to sync progress</button>}{session && <button className="button-secondary" onClick={async () => { await refreshCloudLeaderboard(); setView("leaderboard"); }}>Refresh cloud leaderboard</button>}</section></main>}

    {view === "history" && <main className="results-page extra-page"><button className="back-link" onClick={resetHome}>← Back to discover</button><div className="section-heading"><div><div className="kicker">YOUR LEARNING JOURNEY</div><h2>Quiz <span>history.</span></h2><p>Your latest results are stored on this device.</p></div><button className="button-secondary" onClick={() => { setHistory([]); localStorage.removeItem("qv-history"); }}>Clear history</button></div>{history.length ? <div className="review-grid">{history.map(item => <article className="review-card" key={item.id}><div className="review-card-top"><span className="review-status correct">{item.accuracy}% ACCURACY</span><span>{new Date(item.date).toLocaleDateString()}</span></div><h3>{item.topic === "All topics" ? item.category : item.topic}</h3><p>{item.name} · {item.score}/{item.total} correct</p><p className="review-explanation">{item.duration}s recorded session</p></article>)}</div> : <div className="empty-state">No quizzes completed yet. Your first result will appear here.</div>}</main>}

    {view === "leaderboard" && <main className="results-page extra-page"><button className="back-link" onClick={resetHome}>← Back to discover</button><div className="setup-heading"><div className="kicker">FRIENDLY COMPETITION</div><h1>{session ? "Community " : "Local "}<span>leaderboard.</span></h1><p>{session ? "Community rankings from the Quiz Verse cloud." : "Rankings from quiz results saved in this browser."}</p></div>{leaderboard.length ? <div className="leaderboard-list">{leaderboard.map((item,index) => <article className="leaderboard-row" key={item.id}><strong className="leader-rank">{String(index+1).padStart(2,"0")}</strong><div className="leader-info"><b>{item.name}</b><span>{item.topic === "All topics" ? item.category : item.topic}</span></div><div className="leader-score"><strong>{item.score}/{item.total}</strong><span>{item.accuracy}% accuracy</span></div></article>)}</div> : <div className="empty-state">Complete a quiz to enter the leaderboard.</div>}<p className="field-hint">{session ? "Cloud leaderboard loaded from Supabase when available." : "Sign in to sync results and access cloud features."}</p></main>}

    {view === "results" && <main className="results-page"><button className="back-link" onClick={resetHome}>← Back to discover</button><div className="results-hero"><div className="results-symbol">{score/questions.length>=.8?"✦":"↗"}</div><div className="kicker">CHALLENGE COMPLETE</div><h1>{score/questions.length>=.8?"Look at that growth.":"Every answer counts."}</h1><p>You showed up, thought it through, and learned something. That's a win.</p>{cloudNotice && <p className="field-hint" role="status">{cloudNotice}</p>}<div className="result-score"><div className="score-ring" style={{"--score":`${Math.round(score/questions.length*100)}%`}}><div><strong>{Math.round(score/questions.length*100)}<small>%</small></strong><span>ACCURACY</span></div></div><div className="result-stat-block"><span>YOUR SCORE</span><strong>{score}<small> / {questions.length}</small></strong><span className="result-tag">{score/questions.length>=.8?"✦ STRONG WORK":"↗ KEEP BUILDING"}</span></div></div><div className="results-actions"><button className="button-primary" onClick={() => setView("setup")}>Try another quiz <span>↗</span></button><button className="button-secondary" onClick={startQuiz}>Retry this quiz <span>↻</span></button></div></div><section className="review-section"><div className="section-heading review-heading"><div><div className="kicker">LEARN FROM EVERY ANSWER</div><h2>Your answer <span>review.</span></h2><p>Small corrections today. Stronger instincts tomorrow.</p></div><span className="review-count">{answers.length} QUESTIONS REVIEWED</span></div><div className="review-grid">{answers.map((a,i)=><article key={`${a.question.question}-${i}`} className="review-card"><div className="review-card-top"><span className={a.correct?"review-status correct":"review-status incorrect"}>{a.correct?"✓ CORRECT":"× REVIEW"}</span><span>Q{String(i+1).padStart(2,"0")}</span></div><h3>{a.question.question}</h3><p className="your-answer">Your answer: <strong>{a.selected === null ? (a.timedOut ? "Time ran out" : "Not answered") : a.question.options[a.selected]}</strong></p>{!a.correct&&<p className="correct-answer">Correct answer: <strong>{a.question.options[a.question.answer]}</strong></p>}<p className="review-explanation">{a.question.explanation}</p></article>)}</div></section></main>}
  </div>;
}
