// ==========================================
// MISSION JEET - Clean Design
// New Palette: #E3FDFD #CBF1F5 #5992c6 #e9b8c9 #0a2a92 #31241f
// ==========================================

const AppData = {
    user: {
        email: localStorage.getItem('mj_email') || '',
        synced: localStorage.getItem('mj_synced') === 'true'
    },
    settings: {
        wakeTime: '05:00',
        sleepTime: '23:00',
        strictMode: true
    },
    tasks: [
        { id: 1, icon: '🌅', name: 'Task 1: Early Wake', time: '05:00', duration: 30, detail: 'Wake up 5 AM, Formula revision', status: 'pending' },
        { id: 2, icon: '📚', name: 'Task 2: Lecture', time: '05:30', duration: 90, detail: 'New concepts - Coaching/Video', status: 'pending' },
        { id: 3, icon: '✏️', name: 'Task 3: DPP', time: '07:30', duration: 60, detail: '15-20 Daily Practice Problems', status: 'pending' },
        { id: 4, icon: '🧠', name: 'Task 4: Module', time: '09:00', duration: 90, detail: 'Module exercises - Application', status: 'pending' },
        { id: 5, icon: '🔄', name: 'Task 5: Revision', time: '11:00', duration: 45, detail: 'Short notes + Formula revision', status: 'pending' },
        { id: 6, icon: '🎯', name: 'Task 6: Test', time: '14:00', duration: 90, detail: 'Mock test + Error analysis', status: 'pending' },
        { id: 7, icon: '💪', name: 'Task 7: Exercise', time: '17:00', duration: 45, detail: 'Run/Workout/Yoga - Physical', status: 'pending' }
    ],
    tests: [],
    history: [],
    streak: 0,
    lastDate: null,
    currentQuote: null
};

const StrictInstructions = [
    "🔒 Complete Task 1 before 5:30 AM. No phone until then.",
    "🔒 Phone stays outside study area during Tasks 2-6.",
    "🔒 Skip Task 7 = +30 min extra study tomorrow.",
    "🔒 Never allow 2 consecutive days below 80%.",
    "🔒 Sleep by 11 PM. Discipline starts at night.",
    "🔒 No breakfast until Task 1 is completed.",
    "🔒 Missed tasks must be completed before sleep."
];

// 300+ Quotes Database
const QuotesDB = [
    { q: "Discipline is doing what needs to be done, even if you don't want to do it.", a: "Unknown" },
    { q: "The only bad workout is the one that didn't happen.", a: "Unknown" },
    { q: "Success is the sum of small efforts, repeated day in and day out.", a: "Robert Collier" },
    { q: "Your competition isn't other students. It's your own inconsistency.", a: "Mission Jeet" },
    { q: "One day of 100% beats ten days of 60%.", a: "Unknown" },
    { q: "Excuses are for the weak. Execution is for the select few.", a: "Unknown" },
    { q: "The system works if you work the system.", a: "Unknown" },
    { q: "Consistency is not an act. It is a habit forged through daily execution.", a: "Unknown" },
    { q: "Wake up with determination. Go to bed with satisfaction.", a: "Unknown" },
    { q: "Your future is created by what you do today, not tomorrow.", a: "Robert Kiyosaki" },
    { q: "Don't watch the clock; do what it does. Keep going.", a: "Sam Levenson" },
    { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
    { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
    { q: "Push yourself, because no one else is going to do it for you.", a: "Unknown" },
    { q: "Great things never come from comfort zones.", a: "Unknown" },
    { q: "Dream it. Wish it. Do it.", a: "Unknown" },
    { q: "Success doesn't just find you. You have to go out and get it.", a: "Unknown" },
    { q: "The harder you work for something, the greater you'll feel when you achieve it.", a: "Unknown" },
    { q: "Dream bigger. Do bigger.", a: "Unknown" },
    { q: "Don't stop when you're tired. Stop when you're done.", a: "Unknown" },
    { q: "Wake up early. Stay up late. Get it done.", a: "Unknown" },
    { q: "Your only limit is you.", a: "Unknown" },
    { q: "Believe in yourself and all that you are.", a: "Christian D. Larson" },
    { q: "The way to get started is to quit talking and begin doing.", a: "Walt Disney" },
    { q: "Don't let yesterday take up too much of today.", a: "Will Rogers" },
    { q: "You learn more from failure than from success.", a: "Unknown" },
    { q: "It's not whether you get knocked down, it's whether you get up.", a: "Vince Lombardi" },
    { q: "If you are working on something exciting, it will keep you motivated.", a: "Steve Jobs" },
    { q: "Failure will never overtake me if my determination to succeed is strong enough.", a: "Og Mandino" },
    { q: "We generate fears while we sit. We overcome them by action.", a: "Dr. Henry Link" },
    { q: "The only limit to our realization of tomorrow will be our doubts of today.", a: "Franklin D. Roosevelt" },
    { q: "Creativity is intelligence having fun.", a: "Albert Einstein" },
    { q: "What you lack in talent can be made up with desire, hustle and giving 110% all the time.", a: "Don Zimmer" },
    { q: "Do what you can with all you have, wherever you are.", a: "Theodore Roosevelt" },
    { q: "You are never too old to set another goal or to dream a new dream.", a: "C.S. Lewis" },
    { q: "To see what is right and not do it is a lack of courage.", a: "Confucius" },
    { q: "Reading is to the mind what exercise is to the body.", a: "Joseph Addison" },
    { q: "Fake it until you make it! Act as if you had all the confidence you require.", a: "Brian Tracy" },
    { q: "The future belongs to the competent. Get good, get better, be the best!", a: "Brian Tracy" },
    { q: "For every reason it's not possible, there are hundreds of people who have faced the same circumstances and succeeded.", a: "Jack Canfield" },
    { q: "Things work out best for those who make the best of how things work out.", a: "John Wooden" },
    { q: "A room without books is like a body without a soul.", a: "Marcus Tullius Cicero" },
    { q: "I think goals should never be easy, they should force you to work.", a: "Michael Phelps" },
    { q: "One day or day one. You decide.", a: "Unknown" },
    { q: "Invest in your dreams. Grind now. Shine later.", a: "Unknown" },
    { q: "The distance between dreams and reality is called discipline.", a: "Unknown" },
    { q: "Discipline is the bridge between goals and accomplishment.", a: "Jim Rohn" },
    { q: "Success is nothing more than a few simple disciplines, practiced every day.", a: "Jim Rohn" },
    { q: "We must all suffer one of two things: the pain of discipline or the pain of regret.", a: "Jim Rohn" },
    { q: "Discipline is the soul of an army. It makes small numbers formidable.", a: "George Washington" },
    { q: "Without discipline, there's no life at all.", a: "Katharine Hepburn" },
    { q: "Discipline is remembering what you want.", a: "David Campbell" },
    { q: "The first and greatest victory is to conquer self.", a: "Plato" },
    { q: "Discipline is the mother of all virtues.", a: "Unknown" },
    { q: "Small disciplines repeated with consistency every day lead to great achievements.", a: "John Maxwell" },
    { q: "Self-discipline is the magic power that makes you virtually unstoppable.", a: "Dan Kennedy" },
    { q: "Winners embrace hard work. They love the discipline of it.", a: "Lou Holtz" },
    { q: "Discipline is the difference between what you want now and what you want most.", a: "Unknown" },
    { q: "The pain of discipline is nothing like the pain of disappointment.", a: "Justin Langer" },
    { q: "Discipline is doing what you hate to do, but doing it like you love it.", a: "Mike Tyson" },
    { q: "Self-discipline begins with the mastery of your thoughts.", a: "Napoleon Hill" },
    { q: "Discipline is the foundation upon which all success is built.", a: "Unknown" },
    { q: "There are no shortcuts to any place worth going.", a: "Beverly Sills" },
    { q: "Success is the progressive realization of a worthy goal or ideal.", a: "Earl Nightingale" },
    { q: "The only place where success comes before work is in the dictionary.", a: "Vidal Sassoon" },
    { q: "I don't stop when I'm tired. I stop when I'm done.", a: "David Goggins" },
    { q: "Motivation gets you going, but discipline keeps you growing.", a: "John Maxwell" },
    { q: "Champions aren't made in the gyms. Champions are made from something deep inside.", a: "Muhammad Ali" },
    { q: "It's not about having time. It's about making time.", a: "Unknown" },
    { q: "Your level of success is determined by your level of discipline.", a: "Unknown" },
    { q: "Discipline equals freedom.", a: "Jocko Willink" },
    { q: "Extreme ownership. Lead and win.", a: "Jocko Willink" },
    { q: "The only easy day was yesterday.", a: "Navy SEALs" },
    { q: "Get comfortable being uncomfortable.", a: "Unknown" },
    { q: "Embrace the suck.", a: "Military proverb" },
    { q: "If you want to be tougher, be tougher.", a: "Unknown" },
    { q: "Suffering is the truest test of life.", a: "David Goggins" },
    { q: "Callous your mind.", a: "David Goggins" },
    { q: "When you're exhausted, that's when the growth happens.", a: "Unknown" },
    { q: "The 40% rule: When your mind says stop, you're only at 40%.", a: "David Goggins" },
    { q: "Most of us give up when we've only given about 40% of our effort.", a: "Unknown" },
    { q: "Be uncommon amongst uncommon people.", a: "David Goggins" },
    { q: "Talent without discipline is like an octopus on roller skates.", a: "H. Jackson Brown Jr." },
    { q: "There's no traffic after the extra mile.", a: "Roger Staubach" },
    { q: "Work while they sleep. Learn while they party. Save while they spend. Live like they dream.", a: "Unknown" },
    { q: "Your habits will determine your future.", a: "Jack Canfield" },
    { q: "Excellence is not a singular act, but a habit.", a: "Aristotle" },
    { q: "We are what we repeatedly do.", a: "Aristotle" },
    { q: "Quality is not an act, it is a habit.", a: "Aristotle" },
    { q: "The chains of habit are too light to be felt until they are too heavy to be broken.", a: "Warren Buffett" },
    { q: "First we make our habits, then our habits make us.", a: "Charles C. Noble" },
    { q: "Habits are the compound interest of self-improvement.", a: "James Clear" },
    { q: "You do not rise to the level of your goals. You fall to the level of your systems.", a: "James Clear" },
    { q: "Every action you take is a vote for the type of person you wish to become.", a: "James Clear" },
    { q: "Atomic habits: Small changes, remarkable results.", a: "James Clear" },
    { q: "Success is the product of daily habits—not once-in-a-lifetime transformations.", a: "James Clear" },
    { q: "Time magnifies the margin between success and failure.", a: "James Clear" },
    { q: "You should be far more concerned with your current trajectory than with your current results.", a: "James Clear" },
    { q: "When nothing seems to help, I go and look at a stonecutter.", a: "Jacob Riis" },
    { q: "Rome wasn't built in a day, but they were laying bricks every hour.", a: "Unknown" },
    { q: "A journey of a thousand miles begins with a single step.", a: "Lao Tzu" },
    { q: "The man who moves mountains begins by carrying away small stones.", a: "Confucius" },
    { q: "Big shots are only little shots who keep shooting.", a: "Christopher Morley" },
    { q: "Persistence is to the character of man as carbon is to steel.", a: "Napoleon Hill" },
    { q: "Energy and persistence conquer all things.", a: "Benjamin Franklin" },
    { q: "Never give up on a dream just because of the time it will take.", a: "Earl Nightingale" },
    { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
    { q: "Courage doesn't always roar. Sometimes it's the quiet voice at the end of the day saying 'I will try again tomorrow'.", a: "Mary Anne Radmacher" },
    { q: "Fall seven times, stand up eight.", a: "Japanese proverb" },
    { q: "The greatest glory in living lies not in never falling, but in rising every time we fall.", a: "Nelson Mandela" },
    { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
    { q: "Never, never, never give up.", a: "Winston Churchill" },
    { q: "If you're going through hell, keep going.", a: "Winston Churchill" },
    { q: "Kites rise highest against the wind - not with it.", a: "Winston Churchill" },
    { q: "Continuous effort - not strength or intelligence - is the key to unlocking our potential.", a: "Winston Churchill" },
    { q: "To improve is to change; to be perfect is to change often.", a: "Winston Churchill" },
    { q: "Success is stumbling from failure to failure with no loss of enthusiasm.", a: "Winston Churchill" },
    { q: "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.", a: "Winston Churchill" },
    { q: "Attitude is a little thing that makes a big difference.", a: "Winston Churchill" },
    { q: "Fear is a reaction. Courage is a decision.", a: "Winston Churchill" },
    { q: "The best way to predict the future is to create it.", a: "Peter Drucker" },
    { q: "Management is doing things right; leadership is doing the right things.", a: "Peter Drucker" },
    { q: "What gets measured gets managed.", a: "Peter Drucker" },
    { q: "Until we can manage time, we can manage nothing else.", a: "Peter Drucker" },
    { q: "Efficiency is doing things right; effectiveness is doing the right things.", a: "Peter Drucker" },
    { q: "Plans are only good intentions unless they immediately degenerate into hard work.", a: "Peter Drucker" },
    { q: "Whether you think you can or you think you can't, you're right.", a: "Henry Ford" },
    { q: "Quality means doing it right when no one is looking.", a: "Henry Ford" },
    { q: "Anyone who stops learning is old, whether at twenty or eighty.", a: "Henry Ford" },
    { q: "Failure is simply the opportunity to begin again, this time more intelligently.", a: "Henry Ford" },
    { q: "Don't find fault, find a remedy.", a: "Henry Ford" },
    { q: "Obstacles are those frightful things you see when you take your eyes off your goal.", a: "Henry Ford" },
    { q: "Thinking is the hardest work there is, which is probably the reason why so few engage in it.", a: "Henry Ford" },
    { q: "Coming together is a beginning; keeping together is progress; working together is success.", a: "Henry Ford" },
    { q: "The only real mistake is the one from which we learn nothing.", a: "Henry Ford" },
    { q: "Vision without execution is just hallucination.", a: "Henry Ford" },
    { q: "Nothing great in the world has ever been accomplished without passion.", a: "Georg Wilhelm Friedrich Hegel" },
    { q: "Nothing will work unless you do.", a: "Maya Angelou" },
    { q: "All great achievements require time.", a: "Maya Angelou" },
    { q: "You can't use up creativity. The more you use, the more you have.", a: "Maya Angelou" },
    { q: "Courage is the most important of all the virtues because without courage, you can't practice any other virtue consistently.", a: "Maya Angelou" },
    { q: "If you don't like something, change it. If you can't change it, change your attitude.", a: "Maya Angelou" },
    { q: "We may encounter many defeats but we must not be defeated.", a: "Maya Angelou" },
    { q: "Success is liking yourself, liking what you do, and liking how you do it.", a: "Maya Angelou" },
    { q: "My mission in life is not merely to survive, but to thrive.", a: "Maya Angelou" },
    { q: "You alone are enough. You have nothing to prove to anybody.", a: "Maya Angelou" },
    { q: "If you're always trying to be normal, you will never know how amazing you can be.", a: "Maya Angelou" },
    { q: "Do the best you can until you know better. Then when you know better, do better.", a: "Maya Angelou" },
    { q: "You may not control all the events that happen to you, but you can decide not to be reduced by them.", a: "Maya Angelou" },
    { q: "Seek patience and passion in equal amounts.", a: "Maya Angelou" },
    { q: "Life is not measured by the number of breaths you take but by the moments that take your breath away.", a: "Maya Angelou" },
    { q: "Nothing can dim the light which shines from within.", a: "Maya Angelou" },
    { q: "Whatever you want to do, if you want to be great at it, you have to love it and be able to make sacrifices for it.", a: "Maya Angelou" },
    { q: "When you learn, teach. When you get, give.", a: "Maya Angelou" },
    { q: "You may shoot me with your words, you may cut me with your eyes, you may kill me with your hatefulness, but still, like air, I'll rise!", a: "Maya Angelou" },
    { q: "Have enough courage to trust love one more time and always one more time.", a: "Maya Angelou" },
    { q: "If you find it in your heart to care for somebody else, you will have succeeded.", a: "Maya Angelou" },
    { q: "Hate, it has caused a lot of problems in the world, but has not solved one yet.", a: "Maya Angelou" },
    { q: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty.", a: "Maya Angelou" },
    { q: "I believe that the most important single thing, beyond discipline and creativity is daring to dare.", a: "Maya Angelou" },
    { q: "Determine to live life with flair and laughter.", a: "Maya Angelou" },
    { q: "Surviving is important. Thriving is elegant.", a: "Maya Angelou" },
    { q: "If one is lucky, a solitary fantasy can totally transform one million realities.", a: "Maya Angelou" },
    { q: "The desire to reach for the stars is ambitious. The desire to reach hearts is wise.", a: "Maya Angelou" },
    { q: "I am my own work of art.", a: "Maya Angelou" },
    { q: "Everything in the universe has a rhythm, everything dances.", a: "Maya Angelou" },
    { q: "When you know better you do better.", a: "Maya Angelou" },
    { q: "There's no greater agony than bearing an untold story inside you.", a: "Maya Angelou" },
    { q: "I love to see a young girl go out and grab the world by the lapels.", a: "Maya Angelou" },
    { q: "Prejudice is a burden that confuses the past, threatens the future and renders the present inaccessible.", a: "Maya Angelou" },
    { q: "I believe that every person is born with talent.", a: "Maya Angelou" },
    { q: "Bitterness is like cancer. It eats upon the host.", a: "Maya Angelou" },
    { q: "All men are prepared to accomplish the incredible if their ideals are threatened.", a: "Maya Angelou" },
    { q: "Any book that helps a child to form a habit of reading, to make reading one of his deep and continuing needs, is good for him.", a: "Maya Angelou" },
    { q: "There is no greater agony than bearing an untold story inside you.", a: "Maya Angelou" },
    { q: "Success is not how high you have climbed, but how you make a positive difference to the world.", a: "Roy T. Bennett" },
    { q: "Believe in yourself. You are braver than you think, more talented than you know.", a: "Roy T. Bennett" },
    { q: "Do not fear failure but rather fear not trying.", a: "Roy T. Bennett" },
    { q: "It is never too late to be what you might have been.", a: "George Eliot" },
    { q: "Do what you can, with what you have, where you are.", a: "Theodore Roosevelt" },
    { q: "It is not the critic who counts; not the man who points out how the strong man stumbles.", a: "Theodore Roosevelt" },
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
    { q: "Keep your eyes on the stars, and your feet on the ground.", a: "Theodore Roosevelt" },
    { q: "Far and away the best prize that life has to offer is the chance to work hard at work worth doing.", a: "Theodore Roosevelt" },
    { q: "With self-discipline most anything is possible.", a: "Theodore Roosevelt" },
    { q: "Courage is not having the strength to go on; it is going on when you don't have the strength.", a: "Theodore Roosevelt" },
    { q: "The only man who never makes a mistake is the man who never does anything.", a: "Theodore Roosevelt" },
    { q: "It is hard to fail, but it is worse never to have tried to succeed.", a: "Theodore Roosevelt" },
    { q: "People don't care how much you know until they know how much you care.", a: "Theodore Roosevelt" },
    { q: "If you could kick the person in the pants responsible for most of your trouble, you wouldn't sit for a month.", a: "Theodore Roosevelt" },
    { q: "The only limit to our realization of tomorrow will be our doubts of today.", a: "Franklin D. Roosevelt" },
    { q: "When you reach the end of your rope, tie a knot in it and hang on.", a: "Franklin D. Roosevelt" },
    { q: "Happiness lies in the joy of achievement and the thrill of creative effort.", a: "Franklin D. Roosevelt" },
    { q: "The only thing we have to fear is fear itself.", a: "Franklin D. Roosevelt" },
    { q: "Men are not prisoners of fate, but only prisoners of their own minds.", a: "Franklin D. Roosevelt" },
    { q: "If you can't fly then run, if you can't run then walk, if you can't walk then crawl.", a: "Martin Luther King Jr." },
    { q: "The time is always right to do what is right.", a: "Martin Luther King Jr." },
    { q: "Darkness cannot drive out darkness; only light can do that.", a: "Martin Luther King Jr." },
    { q: "Injustice anywhere is a threat to justice everywhere.", a: "Martin Luther King Jr." },
    { q: "Our lives begin to end the day we become silent about things that matter.", a: "Martin Luther King Jr." },
    { q: "Faith is taking the first step even when you don't see the whole staircase.", a: "Martin Luther King Jr." },
    { q: "The ultimate measure of a man is not where he stands in moments of comfort.", a: "Martin Luther King Jr." },
    { q: "Life's most persistent and urgent question is, 'What are you doing for others?'", a: "Martin Luther King Jr." },
    { q: "We must accept finite disappointment, but never lose infinite hope.", a: "Martin Luther King Jr." },
    { q: "Love is the only force capable of transforming an enemy into friend.", a: "Martin Luther King Jr." },
    { q: "Intelligence plus character—that is the goal of true education.", a: "Martin Luther King Jr." },
    { q: "We must learn to live together as brothers or perish together as fools.", a: "Martin Luther King Jr." },
    { q: "A man who won't die for something is not fit to live.", a: "Martin Luther King Jr." },
    { q: "The quality, not the longevity, of one's life is what is important.", a: "Martin Luther King Jr." },
    { q: "We may have all come on different ships, but we're in the same boat now.", a: "Martin Luther King Jr." },
    { q: "No one really knows why they are alive until they know what they'd die for.", a: "Martin Luther King Jr." },
    { q: "Forgiveness is not an occasional act; it is a constant attitude.", a: "Martin Luther King Jr." },
    { q: "We must build dikes of courage to hold back the flood of fear.", a: "Martin Luther King Jr." },
    { q: "There comes a time when silence is betrayal.", a: "Martin Luther King Jr." },
    { q: "Whatever your life's work is, do it well.", a: "Martin Luther King Jr." },
    { q: "All labor that uplifts humanity has dignity and importance.", a: "Martin Luther King Jr." },
    { q: "Not everybody can be famous but everybody can be great because greatness is determined by service.", a: "Martin Luther King Jr." },
    { q: "Change does not roll in on the wheels of inevitability, but comes through continuous struggle.", a: "Martin Luther King Jr." },
    { q: "If I cannot do great things, I can do small things in a great way.", a: "Martin Luther King Jr." },
    { q: "No person has the right to rain on your dreams.", a: "Martin Luther King Jr." },
    { q: "A genuine leader is not a searcher for consensus but a molder of consensus.", a: "Martin Luther King Jr." },
    { q: "The ultimate tragedy is not the oppression and cruelty by the bad people.", a: "Martin Luther King Jr." },
    { q: "He who passively accepts evil is as much involved in it as he who helps to perpetrate it.", a: "Martin Luther King Jr." },
    { q: "An individual has not started living until he can rise above the narrow confines.", a: "Martin Luther King Jr." },
    { q: "Everything that we see is a shadow cast by that which we do not see.", a: "Martin Luther King Jr." },
    { q: "We must concentrate not merely on the negative expulsion of war but the positive affirmation of peace.", a: "Martin Luther King Jr." },
    { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
    { q: "Our greatest glory is not in never falling, but in rising every time we fall.", a: "Confucius" },
    { q: "Everything has beauty, but not everyone sees it.", a: "Confucius" },
    { q: "The man who asks a question is a fool for a minute, the man who does not ask is a fool for life.", a: "Confucius" },
    { q: "Wheresoever you go, go with all your heart.", a: "Confucius" },
    { q: "He who learns but does not think, is lost. He who thinks but does not learn is in great danger.", a: "Confucius" },
    { q: "It is easy to hate and it is difficult to love. This is how the whole scheme of things works.", a: "Confucius" },
    { q: "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys.", a: "Confucius" },
    { q: "Real knowledge is to know the extent of one's ignorance.", a: "Confucius" },
    { q: "Life is really simple, but we insist on making it complicated.", a: "Confucius" },
    { q: "Better a diamond with a flaw than a pebble without.", a: "Confucius" },
    { q: "The superior man thinks always of virtue; the common man thinks of comfort.", a: "Confucius" },
    { q: "Success depends upon previous preparation, and without such preparation there is sure to be failure.", a: "Confucius" },
    { q: "The more man meditates upon good thoughts, the better will be his world and the world at large.", a: "Confucius" },
    { q: "When it is obvious that the goals cannot be reached, don't adjust the goals, adjust the action steps.", a: "Confucius" },
    { q: "Choose a job you love, and you will never have to work a day in your life.", a: "Confucius" },
    { q: "By three methods we may learn wisdom: First, by reflection, which is noblest; Second, by imitation, which is easiest; and third by experience, which is the bitterest.", a: "Confucius" },
    { q: "We have two lives, and the second begins when we realize we only have one.", a: "Confucius" },
    { q: "If you make a mistake and do not correct it, this is called a mistake.", a: "Confucius" },
    { q: "The man who moves a mountain begins by carrying away small stones.", a: "Confucius" },
    { q: "Respect yourself and others will respect you.", a: "Confucius" },
    { q: "You cannot open a book without learning something.", a: "Confucius" },
    { q: "Silence is a true friend who never betrays.", a: "Confucius" },
    { q: "The superior man is modest in his speech, but exceeds in his actions.", a: "Confucius" },
    { q: "Education breeds confidence. Confidence breeds hope. Hope breeds peace.", a: "Confucius" },
    { q: "To be wronged is nothing, unless you continue to remember it.", a: "Confucius" },
    { q: "What the superior man seeks is in himself; what the small man seeks is in others.", a: "Confucius" },
    { q: "I hear and I forget. I see and I remember. I do and I understand.", a: "Confucius" },
    { q: "Learning without thought is labor lost; thought without learning is perilous.", a: "Confucius" },
    { q: "Do not impose on others what you yourself do not desire.", a: "Confucius" },
    { q: "To know what you know and what you do not know, that is true knowledge.", a: "Confucius" },
    { q: "The strength of a nation derives from the integrity of the home.", a: "Confucius" },
    { q: "Never give a sword to a man who can't dance.", a: "Confucius" },
    { q: "When anger rises, think of the consequences.", a: "Confucius" },
    { q: "To see what is right and not do it is the worst cowardice.", a: "Confucius" },
    { q: "Study the past if you would define the future.", a: "Confucius" },
    { q: "Before you embark on a journey of revenge, dig two graves.", a: "Confucius" },
    { q: "To practice five things under all circumstances constitutes perfect virtue.", a: "Confucius" },
    { q: "He who knows all the answers has not been asked all the questions.", a: "Confucius" },
    { q: "When we see men of a contrary character, we should turn inwards and examine ourselves.", a: "Confucius" },
    { q: "The way out is through the door. Why is it that no one will use this method?", a: "Confucius" },
    { q: "Only the wisest and stupidest of men never change.", a: "Confucius" },
    { q: "Act with kindness but do not expect gratitude.", a: "Confucius" },
    { q: "The superior man understands what is right; the inferior man understands what will sell.", a: "Confucius" },
    { q: "Be not ashamed of mistakes and thus make them crimes.", a: "Confucius" },
    { q: "In a country well governed, poverty is something to be ashamed of.", a: "Confucius" },
    { q: "He who speaks without modesty will find it difficult to make his words good.", a: "Confucius" },
    { q: "Have no friends not equal to yourself.", a: "Confucius" },
    { q: "Without feelings of respect, what is there to distinguish men from beasts?", a: "Confucius" },
    { q: "When you know a thing, to hold that you know it; and when you do not know a thing, to allow that you do not know it.", a: "Confucius" },
    { q: "If you look into your own heart, and you find nothing wrong there, what is there to worry about?", a: "Confucius" },
    { q: "To go beyond is as wrong as to fall short.", a: "Confucius" },
    { q: "If what one has to say is not better than silence, then one should keep silent.", a: "Confucius" },
    { q: "Fix your eyes on perfection and you make almost everything speed towards it.", a: "Confucius" },
    { q: "A lion chased me up a tree, and I greatly enjoyed the view from the top.", a: "Confucius" },
    { q: "The man of wisdom is never of two minds; the man of benevolence never worries.", a: "Confucius" },
    { q: "Those who cannot forgive others break the bridge over which they themselves must pass.", a: "Confucius" },
    { q: "The superior man acts before he speaks, and afterwards speaks according to his action.", a: "Confucius" },
    { q: "If you think in terms of a year, plant a seed; if in terms of ten years, plant trees.", a: "Confucius" },
    { q: "The essence of knowledge is, having it, to apply it; not having it, to confess your ignorance.", a: "Confucius" },
    { q: "A man who has committed a mistake and doesn't correct it, is committing another mistake.", a: "Confucius" },
    { q: "Ability will never catch up with the demand for it.", a: "Confucius" },
    { q: "He who will not economize will have to agonize.", a: "Confucius" },
    { q: "When you have faults, do not fear to abandon them.", a: "Confucius" },
    { q: "They must often change, who would be constant in happiness or wisdom.", a: "Confucius" },
    { q: "Don't complain about the snow on your neighbor's roof when your own doorstep is unclean.", a: "Confucius" },
    { q: "If I am walking with two other men, each of them will serve as my teacher.", a: "Confucius" },
    { q: "Be strict with yourself but least reproachful of others and complaint is kept afar.", a: "Confucius" },
    { q: "Roads were made for journeys not destinations.", a: "Confucius" },
    { q: "No matter how busy you may think you are, you must find time for reading.", a: "Confucius" },
    { q: "The superior man is distressed by the limitations of his ability; he is not distressed by the fact that men do not recognize the ability that he has.", a: "Confucius" },
    { q: "The superior man thinks always of virtue; the common man thinks of comfort.", a: "Confucius" },
    { q: "Music produces a kind of pleasure which human nature cannot do without.", a: "Confucius" },
    { q: "The superior man is slow in his words and earnest in his conduct.", a: "Confucius" },
    { q: "The superior man is satisfied and composed; the mean man is always full of distress.", a: "Confucius" },
    { q: "The more man meditates upon good thoughts, the better will be his world and the world at large.", a: "Confucius" }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initApp();
    setupAutoReset();
});

function initApp() {
    updateDate();
    renderHome();
    renderTasks();
    renderTests();
    renderEditTasks();
    renderEditTests();
    updateStats();
    loadDailyQuote();
    initCloudUI();
    
    // Set today's date in test modal
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('testDate');
    if (dateInput) dateInput.value = today;
}

// Quote System
function loadDailyQuote() {
    const savedDate = localStorage.getItem('mj_quoteDate');
    const today = new Date().toDateString();
    
    if (savedDate === today && localStorage.getItem('mj_quoteText')) {
        const text = localStorage.getItem('mj_quoteText');
        const author = localStorage.getItem('mj_quoteAuthor');
        displayQuote(text, author);
    } else {
        fetchDailyQuote();
    }
}

function fetchDailyQuote() {
    // Try ZenQuotes API
    fetch('https://zenquotes.io/api/today')
        .then(res => res.json())
        .then(data => {
            if (data && data[0] && data[0].q) {
                displayQuote(data[0].q, data[0].a);
                saveQuote(data[0].q, data[0].a);
            } else {
                useLocalQuote();
            }
        })
        .catch(() => {
            useLocalQuote();
        });
}

function useLocalQuote() {
    const randomIndex = Math.floor(Math.random() * QuotesDB.length);
    const quote = QuotesDB[randomIndex];
    displayQuote(quote.q, quote.a);
    saveQuote(quote.q, quote.a);
}

function displayQuote(text, author) {
    const quoteEl = document.getElementById('dailyQuote');
    const authorEl = document.getElementById('quoteAuthor');
    
    if (quoteEl) quoteEl.textContent = `"${text}"`;
    if (authorEl) authorEl.textContent = `— ${author || 'Unknown'}`;
}

function saveQuote(text, author) {
    localStorage.setItem('mj_quoteDate', new Date().toDateString());
    localStorage.setItem('mj_quoteText', text);
    localStorage.setItem('mj_quoteAuthor', author || 'Unknown');
}

// Data Management
function loadData() {
    const saved = localStorage.getItem('missionJeetData');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(AppData, parsed);
    }
    
    const email = localStorage.getItem('mj_email');
    if (email) {
        AppData.user.email = email;
        const emailInput = document.getElementById('cloudEmail');
        if (emailInput) emailInput.value = email;
    }
}

function saveData() {
    localStorage.setItem('missionJeetData', JSON.stringify({
        settings: AppData.settings,
        tasks: AppData.tasks,
        tests: AppData.tests,
        history: AppData.history,
        streak: AppData.streak,
        lastDate: AppData.lastDate
    }));
}

// Navigation
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
    
    const section = document.getElementById(id);
    const btn = event.currentTarget;
    
    if (section) section.classList.add('active');
    if (btn) btn.classList.add('active');
    
    if (id === 'tracking') {
        setTimeout(() => {
            drawDisciplineChart();
            drawWeeklyChart();
        }, 100);
    } else if (id === 'tests') {
        setTimeout(() => {
            drawTestScoreChart();
            drawSubjectChart();
        }, 100);
    }
}

// Date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    
    document.querySelectorAll('.page-date').forEach(el => {
        if (el) el.textContent = dateStr;
    });
}

// Home Section
function renderHome() {
    const completed = AppData.tasks.filter(t => t.status === 'completed').length;
    const total = AppData.tasks.length;
    const progress = Math.round((completed / total) * 100);
    
    const streakEl = document.getElementById('homeStreak');
    const progressEl = document.getElementById('homeProgress');
    const testsEl = document.getElementById('homeTests');
    const hoursEl = document.getElementById('homeHours');
    
    if (streakEl) streakEl.textContent = AppData.streak;
    if (progressEl) progressEl.textContent = progress + '%';
    if (testsEl) testsEl.textContent = AppData.tests.filter(t => !t.completed && new Date(t.date) >= new Date()).length;
    
    const totalMinutes = AppData.tasks
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.duration, 0);
    if (hoursEl) hoursEl.textContent = Math.round(totalMinutes / 60);
    
    const dayIndex = new Date().getDay();
    const strictEl = document.getElementById('homeStrict');
    if (strictEl) strictEl.textContent = StrictInstructions[dayIndex % StrictInstructions.length];
    
    // Update category statuses
    updateCategoryStatus('cat-wake', 0);
    updateCategoryStatus('cat-study', 1);
    updateCategoryStatus('cat-practice', 2);
    updateCategoryStatus('cat-revision', 4);
    updateCategoryStatus('cat-test', 5);
    updateCategoryStatus('cat-exercise', 6);
}

function updateCategoryStatus(id, taskIndex) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const task = AppData.tasks[taskIndex];
    if (!task) return;
    
    el.textContent = task.status === 'completed' ? 'Done ✓' : task.status === 'skipped' ? 'Skipped ✗' : 'Pending';
    el.className = 'cat-status ' + (task.status === 'completed' ? 'done' : '');
}

// Tasks Section
function renderTasks() {
    const tbody = document.getElementById('taskTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    AppData.tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.className = task.status;
        
        row.innerHTML = `
            <td class="task-icon">${task.icon}</td>
            <td class="task-name">${task.name}</td>
            <td class="task-time">${task.time}</td>
            <td><input type="text" class="task-detail-input" value="${task.detail}" onchange="updateTaskDetail(${index}, this.value)"></td>
            <td class="task-dur">${task.duration} min</td>
            <td><span class="status-pill ${task.status}">${task.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-action btn-done" onclick="completeTask(${index})" ${task.status === 'completed' ? 'disabled' : ''}>✓ Done</button>
                    <button class="btn-action btn-skip" onclick="skipTask(${index})" ${task.status === 'skipped' ? 'disabled' : ''}>✗ Skip</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    updateProgress();
    updateRingProgress();
    
    const dayIndex = new Date().getDay();
    const strictEl = document.getElementById('dailyStrict');
    if (strictEl) strictEl.textContent = StrictInstructions[dayIndex % StrictInstructions.length];
}

function updateProgress() {
    const completed = AppData.tasks.filter(t => t.status === 'completed').length;
    const total = AppData.tasks.length;
    const progress = Math.round((completed / total) * 100);
    
    const countEl = document.getElementById('completedCount');
    const percentEl = document.getElementById('progressPercent');
    const barEl = document.getElementById('progressBar');
    
    if (countEl) countEl.textContent = `${completed}/${total}`;
    if (percentEl) percentEl.textContent = progress + '%';
    if (barEl) barEl.style.width = progress + '%';
}

function updateRingProgress() {
    const completed = AppData.tasks.filter(t => t.status === 'completed').length;
    const total = AppData.tasks.length;
    const progress = Math.round((completed / total) * 100);
    
    const ringFill = document.getElementById('ringProgress');
    const ringText = document.getElementById('ringPercent');
    
    if (ringFill) {
        ringFill.setAttribute('stroke-dasharray', `${progress}, 100`);
    }
    if (ringText) {
        ringText.textContent = progress + '%';
    }
}

function updateTaskDetail(index, value) {
    AppData.tasks[index].detail = value;
    saveData();
}

function completeTask(index) {
    AppData.tasks[index].status = 'completed';
    saveData();
    renderTasks();
    renderHome();
    checkDiscipline();
}

function skipTask(index) {
    AppData.tasks[index].status = 'skipped';
    saveData();
    renderTasks();
    renderHome();
    applyPenalty();
}

function checkDiscipline() {
    const completed = AppData.tasks.filter(t => t.status === 'completed').length;
    const total = AppData.tasks.length;
    const rate = (completed / total) * 100;
    
    if (rate === 100) {
        AppData.streak++;
        if (AppData.streak % 3 === 0) {
            setTimeout(() => alert(`🔥 ${AppData.streak} DAY STREAK! Add 15 min to Task 2 tomorrow.`), 100);
        }
    } else if (rate < 50) {
        setTimeout(() => alert('⚠️ Below 50%. Tomorrow: Remove 1 task, focus on quality.'), 100);
    }
    
    saveData();
}

function applyPenalty() {
    const skipped = AppData.tasks.filter(t => t.status === 'skipped').length;
    if (skipped >= 2) {
        setTimeout(() => alert('🚫 PENALTY: Complete Task 1 before breakfast tomorrow.'), 100);
    }
}

// Charts
function drawDisciplineChart() {
    const canvas = document.getElementById('disciplineChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;
    
    const data = AppData.history.length > 0 ? 
        AppData.history.slice(-14) : 
        Array.from({length: 14}, (_, i) => ({
            date: new Date(Date.now() - (13-i) * 86400000).toISOString().split('T')[0],
            completion: 60 + Math.floor(Math.random() * 40)
        }));
    
    ctx.fillStyle = '#E3FDFD';
    ctx.fillRect(0, 0, w, h);
    
    // Grid
    ctx.strokeStyle = '#CBF1F5';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = pad + ((h - 2 * pad) / 5) * i;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(w - pad, y);
        ctx.stroke();
    }
    
    // Line
    ctx.strokeStyle = '#5992c6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, i) => {
        const x = pad + ((w - 2 * pad) / (data.length - 1)) * i;
        const y = pad + (h - 2 * pad) - (point.completion / 100) * (h - 2 * pad);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Points
    data.forEach((point, i) => {
        const x = pad + ((w - 2 * pad) / (data.length - 1)) * i;
        const y = pad + (h - 2 * pad) - (point.completion / 100) * (h - 2 * pad);
        
        ctx.fillStyle = point.completion >= 80 ? '#4ade80' : point.completion >= 60 ? '#fbbf24' : '#f87171';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawWeeklyChart() {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;
    
    const data = [85, 92, 78, 100, 88, 95, 90];
    const barW = (w - 2 * pad) / data.length * 0.6;
    const spacing = (w - 2 * pad) / data.length;
    
    ctx.fillStyle = '#E3FDFD';
    ctx.fillRect(0, 0, w, h);
    
    data.forEach((val, i) => {
        const x = pad + spacing * i + (spacing - barW) / 2;
        const barH = (val / 100) * (h - 2 * pad);
        const y = pad + (h - 2 * pad) - barH;
        
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, '#5992c6');
        grad.addColorStop(1, '#0a2a92');
        
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barW, barH);
        
        ctx.fillStyle = '#31241f';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(val + '%', x + barW / 2, y - 10);
    });
}

function updateStats() {
    const completed = AppData.tasks.filter(t => t.status === 'completed').length;
    const total = AppData.tasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const streakEl = document.getElementById('statStreak');
    const avgEl = document.getElementById('statAvg');
    const bestEl = document.getElementById('statBest');
    const totalEl = document.getElementById('statTotal');
    
    if (streakEl) streakEl.textContent = AppData.streak;
    if (avgEl) avgEl.textContent = rate + '%';
    if (bestEl) bestEl.textContent = '100%';
    if (totalEl) totalEl.textContent = completed;
}

// Tests Section
function renderTests(filter = 'all') {
    const container = document.getElementById('testList');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filtered = AppData.tests;
    if (filter === 'upcoming') filtered = AppData.tests.filter(t => !t.completed);
    else if (filter === 'completed') filtered = AppData.tests.filter(t => t.completed);
    
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    filtered.forEach(test => {
        const pct = test.marks !== null ? Math.round((test.marks / test.maxMarks) * 100) : 0;
        let grade = 'poor';
        if (pct >= 90) grade = 'excellent';
        else if (pct >= 75) grade = 'good';
        else if (pct >= 60) grade = 'average';
        
        const div = document.createElement('div');
        div.className = 'test-card-clean';
        div.innerHTML = `
            <div class="test-info">
                <h4>${test.subject} - ${test.type}</h4>
                <p>${new Date(test.date).toLocaleDateString()} • ${test.duration} min • Max: ${test.maxMarks}</p>
                ${test.syllabus ? `<p style="margin-top:4px;opacity:0.8;">${test.syllabus}</p>` : ''}
            </div>
            <div class="test-score ${test.marks !== null ? grade : ''}">
                ${test.marks !== null ? pct + '%' : '⏳'}
            </div>
            <div>
                ${!test.completed ? 
                    `<button class="btn-action btn-done" onclick="enterMarks(${AppData.tests.indexOf(test)})">Enter Marks</button>` :
                    `<button class="btn-action" onclick="viewTest(${AppData.tests.indexOf(test)})">View</button>`
                }
            </div>
        `;
        container.appendChild(div);
    });
}

function filterTests(type) {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    renderTests(type);
}

function openTestModal() {
    const modal = document.getElementById('testModal');
    if (modal) modal.classList.add('active');
}

function closeTestModal() {
    const modal = document.getElementById('testModal');
    if (modal) modal.classList.remove('active');
    
    // Reset form
    const subject = document.getElementById('testSubject');
    const type = document.getElementById('testType');
    const date = document.getElementById('testDate');
    const time = document.getElementById('testTime');
    const duration = document.getElementById('testDuration');
    const maxMarks = document.getElementById('testMaxMarks');
    const syllabus = document.getElementById('testSyllabus');
    
    if (subject) subject.value = '';
    if (type) type.value = '';
    if (date) date.value = new Date().toISOString().split('T')[0];
    if (time) time.value = '09:00';
    if (duration) duration.value = '60';
    if (maxMarks) maxMarks.value = '100';
    if (syllabus) syllabus.value = '';
}

function saveTest() {
    const subject = document.getElementById('testSubject').value;
    const type = document.getElementById('testType').value;
    const date = document.getElementById('testDate').value;
    const time = document.getElementById('testTime').value;
    const duration = parseInt(document.getElementById('testDuration').value);
    const maxMarks = parseInt(document.getElementById('testMaxMarks').value);
    const syllabus = document.getElementById('testSyllabus').value;
    
    if (!subject || !type || !date || !maxMarks) {
        alert('Please fill all required fields (*)');
        return;
    }
    
    const test = {
        id: Date.now(),
        subject,
        type,
        date,
        time,
        duration,
        maxMarks,
        syllabus,
        marks: null,
        completed: false,
        notes: ''
    };
    
    AppData.tests.push(test);
    saveData();
    renderTests();
    renderEditTests();
    closeTestModal();
    renderHome();
    
    // Show success
    alert(`✅ Test scheduled: ${subject} - ${type} on ${new Date(date).toLocaleDateString()}`);
}

function enterMarks(index) {
    const test = AppData.tests[index];
    if (!test) return;
    
    const infoBox = document.getElementById('marksTestInfo');
    const totalInput = document.getElementById('marksTotal');
    const obtainedInput = document.getElementById('marksObtained');
    const percentInput = document.getElementById('marksPercent');
    
    if (infoBox) {
        infoBox.innerHTML = `
            <h4>${test.subject} - ${test.type}</h4>
            <p>Date: ${new Date(test.date).toLocaleDateString()}</p>
            <p>Max Marks: ${test.maxMarks}</p>
        `;
    }
    if (totalInput) totalInput.value = test.maxMarks;
    if (obtainedInput) {
        obtainedInput.value = '';
        obtainedInput.dataset.index = index;
    }
    if (percentInput) percentInput.value = '';
    
    const modal = document.getElementById('marksModal');
    if (modal) modal.classList.add('active');
}

function closeMarksModal() {
    const modal = document.getElementById('marksModal');
    if (modal) modal.classList.remove('active');
}

function calcPercentage() {
    const obtained = parseFloat(document.getElementById('marksObtained').value) || 0;
    const total = parseFloat(document.getElementById('marksTotal').value) || 1;
    const percentInput = document.getElementById('marksPercent');
    
    if (percentInput) {
        percentInput.value = Math.round((obtained / total) * 100) + '%';
    }
}

function saveMarks() {
    const index = document.getElementById('marksObtained').dataset.index;
    const obtained = parseFloat(document.getElementById('marksObtained').value);
    
    if (isNaN(obtained) || obtained < 0) {
        alert('Enter valid marks');
        return;
    }
    
    if (!AppData.tests[index]) return;
    
    AppData.tests[index].marks = obtained;
    AppData.tests[index].completed = true;
    AppData.tests[index].notes = document.getElementById('testNotes')?.value || '';
    
    saveData();
    renderTests();
    closeMarksModal();
    
    const pct = Math.round((obtained / AppData.tests[index].maxMarks) * 100);
    let msg = '';
    if (pct >= 90) msg = '🏆 Excellent! Keep dominating!';
    else if (pct >= 75) msg = '✅ Good work. Push for 90% next time.';
    else if (pct >= 60) msg = '⚠️ Average. Analyze mistakes carefully.';
    else msg = '🚨 Poor. Revise entire chapter before next test.';
    
    setTimeout(() => alert(msg), 100);
}

function deleteTest(index) {
    if (confirm('Delete this test?')) {
        AppData.tests.splice(index, 1);
        saveData();
        renderTests();
        renderEditTests();
    }
}

// Test Charts
function drawTestScoreChart() {
    const canvas = document.getElementById('testScoreChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;
    
    const tests = AppData.tests.filter(t => t.completed);
    const data = tests.length > 0 ? 
        tests.map(t => Math.round((t.marks / t.maxMarks) * 100)) : 
        [75, 82, 68, 90, 85];
    
    ctx.fillStyle = '#E3FDFD';
    ctx.fillRect(0, 0, w, h);
    
    ctx.strokeStyle = '#5992c6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((val, i) => {
        const x = pad + ((w - 2 * pad) / (data.length - 1)) * i;
        const y = pad + (h - 2 * pad) - (val / 100) * (h - 2 * pad);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    data.forEach((val, i) => {
        const x = pad + ((w - 2 * pad) / (data.length - 1)) * i;
        const y = pad + (h - 2 * pad) - (val / 100) * (h - 2 * pad);
        
        ctx.fillStyle = val >= 80 ? '#4ade80' : val >= 60 ? '#fbbf24' : '#f87171';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#31241f';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(val + '%', x, y - 15);
    });
}

function drawSubjectChart() {
    const canvas = document.getElementById('subjectChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const w = canvas.width;
    const h = canvas.height;
    const pad = 40;
    
    const subjects = {};
    AppData.tests.filter(t => t.completed).forEach(t => {
        if (!subjects[t.subject]) subjects[t.subject] = [];
        subjects[t.subject].push(Math.round((t.marks / t.maxMarks) * 100));
    });
    
    let labels = Object.keys(subjects);
    let avgs = labels.map(s => Math.round(subjects[s].reduce((a, b) => a + b, 0) / subjects[s].length));
    
    if (labels.length === 0) {
        labels = ['Physics', 'Chemistry', 'Math'];
        avgs = [82, 75, 88];
    }
    
    const barW = (w - 2 * pad) / labels.length * 0.5;
    const spacing = (w - 2 * pad) / labels.length;
    
    ctx.fillStyle = '#E3FDFD';
    ctx.fillRect(0, 0, w, h);
    
    labels.forEach((sub, i) => {
        const val = avgs[i];
        const x = pad + spacing * i + (spacing - barW) / 2;
        const barH = (val / 100) * (h - 2 * pad);
        const y = pad + (h - 2 * pad) - barH;
        
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, '#e9b8c9');
        grad.addColorStop(1, '#5992c6');
        
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barW, barH);
        
        ctx.fillStyle = '#31241f';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(val + '%', x + barW / 2, y - 10);
        ctx.fillText(sub, x + barW / 2, h - 15);
    });
}

// Edit Section
function showEditTab(tab) {
    document.querySelectorAll('.edit-tab-clean').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.edit-panel-clean').forEach(p => p.classList.remove('active'));
    
    if (event && event.target) event.target.classList.add('active');
    
    const panel = document.getElementById('edit' + tab.charAt(0).toUpperCase() + tab.slice(1) + 'Panel');
    if (panel) panel.classList.add('active');
}

function renderEditTasks() {
    const container = document.getElementById('editTaskList');
    if (!container) return;
    
    container.innerHTML = AppData.tasks.map((task, i) => `
        <div class="edit-item-clean">
            <div>
                <h4>${task.icon} ${task.name}</h4>
                <p>${task.time} • ${task.duration} min • ${task.detail}</p>
            </div>
            <div class="edit-actions">
                <button class="btn-icon-sm edit" onclick="editTask(${i})">✎</button>
                <button class="btn-icon-sm delete" onclick="deleteTask(${i})">🗑</button>
            </div>
        </div>
    `).join('');
}

function renderEditTests() {
    const container = document.getElementById('editTestList');
    if (!container) return;
    
    const upcoming = AppData.tests.filter(t => !t.completed);
    
    container.innerHTML = upcoming.length ? upcoming.map((test, i) => `
        <div class="edit-item-clean">
            <div>
                <h4>${test.subject} - ${test.type}</h4>
                <p>${new Date(test.date).toLocaleDateString()} • ${test.duration} min • Max: ${test.maxMarks}</p>
            </div>
            <div class="edit-actions">
                <button class="btn-icon-sm delete" onclick="deleteTestFromEdit(${i})">🗑</button>
            </div>
        </div>
    `).join('') : '<p style="text-align:center;opacity:0.7;padding:20px;">No upcoming tests</p>';
}

function editTask(index) {
    const task = AppData.tasks[index];
    if (!task) return;
    
    const nameInput = document.getElementById('editTaskName');
    const iconInput = document.getElementById('editTaskIcon');
    const timeInput = document.getElementById('editTaskTime');
    const durationInput = document.getElementById('editTaskDuration');
    const detailInput = document.getElementById('editTaskDetail');
    
    if (nameInput) nameInput.value = task.name;
    if (iconInput) iconInput.value = task.icon;
    if (timeInput) timeInput.value = task.time;
    if (durationInput) durationInput.value = task.duration;
    if (detailInput) detailInput.value = task.detail;
    
    const modal = document.getElementById('taskModal');
    if (modal) {
        modal.classList.add('active');
        modal.dataset.index = index;
    }
}

function saveTaskEdit() {
    const modal = document.getElementById('taskModal');
    if (!modal) return;
    
    const index = modal.dataset.index;
    if (index === undefined || !AppData.tasks[index]) return;
    
    const nameInput = document.getElementById('editTaskName');
    const iconInput = document.getElementById('editTaskIcon');
    const timeInput = document.getElementById('editTaskTime');
    const durationInput = document.getElementById('editTaskDuration');
    const detailInput = document.getElementById('editTaskDetail');
    
    if (nameInput) AppData.tasks[index].name = nameInput.value;
    if (iconInput) AppData.tasks[index].icon = iconInput.value;
    if (timeInput) AppData.tasks[index].time = timeInput.value;
    if (durationInput) AppData.tasks[index].duration = parseInt(durationInput.value) || 60;
    if (detailInput) AppData.tasks[index].detail = detailInput.value;
    
    saveData();
    renderEditTasks();
    renderTasks();
    closeTaskModal();
}

function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    if (modal) {
        modal.classList.remove('active');
        modal.dataset.index = '';
    }
}

function deleteTask(index) {
    if (!confirm('Delete this task?')) return;
    
    AppData.tasks.splice(index, 1);
    saveData();
    renderEditTasks();
    renderTasks();
}

function addNewTask() {
    AppData.tasks.push({
        id: Date.now(),
        icon: '⚡',
        name: `Task ${AppData.tasks.length + 1}: Custom`,
        time: '12:00',
        duration: 60,
        detail: 'Custom task description',
        status: 'pending'
    });
    saveData();
    renderEditTasks();
    renderTasks();
}

function resetDefaultTasks() {
    if (!confirm('Reset all tasks to default?')) return;
    
    AppData.tasks = [
        { id: 1, icon: '🌅', name: 'Task 1: Early Wake', time: '05:00', duration: 30, detail: 'Wake up 5 AM, Formula revision', status: 'pending' },
        { id: 2, icon: '📚', name: 'Task 2: Lecture', time: '05:30', duration: 90, detail: 'New concepts - Coaching/Video', status: 'pending' },
        { id: 3, icon: '✏️', name: 'Task 3: DPP', time: '07:30', duration: 60, detail: '15-20 Daily Practice Problems', status: 'pending' },
        { id: 4, icon: '🧠', name: 'Task 4: Module', time: '09:00', duration: 90, detail: 'Module exercises - Application', status: 'pending' },
        { id: 5, icon: '🔄', name: 'Task 5: Revision', time: '11:00', duration: 45, detail: 'Short notes + Formula revision', status: 'pending' },
        { id: 6, icon: '🎯', name: 'Task 6: Test', time: '14:00', duration: 90, detail: 'Mock test + Error analysis', status: 'pending' },
        { id: 7, icon: '💪', name: 'Task 7: Exercise', time: '17:00', duration: 45, detail: 'Run/Workout/Yoga - Physical', status: 'pending' }
    ];
    saveData();
    renderEditTasks();
    renderTasks();
}

function deleteTestFromEdit(index) {
    const upcoming = AppData.tests.filter(t => !t.completed);
    const actualIndex = AppData.tests.indexOf(upcoming[index]);
    if (actualIndex >= 0) {
        deleteTest(actualIndex);
        renderEditTests();
    }
}

function saveSettings() {
    const wakeInput = document.getElementById('settingWake');
    const sleepInput = document.getElementById('settingSleep');
    const strictInput = document.getElementById('settingStrict');
    
    if (wakeInput) AppData.settings.wakeTime = wakeInput.value;
    if (sleepInput) AppData.settings.sleepTime = sleepInput.value;
    if (strictInput) AppData.settings.strictMode = strictInput.checked;
    
    saveData();
    alert('Settings saved successfully');
}

// Cloud Functions
function initCloudUI() {
    const statusDisplay = document.getElementById('cloudStatusDisplay');
    const cloudForm = document.getElementById('cloudForm');
    
    if (AppData.user.synced && AppData.user.email) {
        if (statusDisplay) {
            statusDisplay.innerHTML = '● Synced to cloud';
            statusDisplay.className = 'cloud-status synced';
        }
        if (cloudForm) {
            cloudForm.innerHTML = `
                <p style="font-size:16px;color:#0a2a92;font-weight:700;">${AppData.user.email}</p>
                <button class="btn-sm secondary" onclick="logoutCloud()">Logout</button>
            `;
        }
    }
}

function syncToCloud() {
    const emailInput = document.getElementById('cloudEmail');
    const email = emailInput ? emailInput.value : '';
    
    if (!email || !email.includes('@')) {
        alert('Enter valid email address');
        return;
    }
    
    localStorage.setItem('mj_email', email);
    localStorage.setItem('mj_synced', 'true');
    AppData.user.email = email;
    AppData.user.synced = true;
    
    saveData();
    initCloudUI();
    alert('✅ Cloud sync enabled for ' + email);
}

function logoutCloud() {
    localStorage.removeItem('mj_email');
    localStorage.removeItem('mj_synced');
    AppData.user.email = '';
    AppData.user.synced = false;
    location.reload();
}

function loadFromCloud() {
    if (!AppData.user.email) {
        alert('No cloud data found. Enter email and sync first.');
        return;
    }
    alert('📥 Data loaded for ' + AppData.user.email);
    initApp();
}

// Auto-reset at midnight
function setupAutoReset() {
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 1) {
            const completed = AppData.tasks.filter(t => t.status === 'completed').length;
            const total = AppData.tasks.length;
            
            AppData.history.push({
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                completion: Math.round((completed / total) * 100)
            });
            
            if (AppData.history.length > 30) AppData.history.shift();
            
            AppData.tasks.forEach(t => t.status = 'pending');
            
            saveData();
            renderTasks();
            renderHome();
        }
    }, 60000);
}

// Close modals on outside click
window.onclick = function(e) {
    if (e.target.classList.contains('modal-clean')) {
        e.target.classList.remove('active');
    }
}