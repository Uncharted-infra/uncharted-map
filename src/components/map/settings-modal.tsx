"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, Plane, Coins, Plug, Bell, ChevronDown, Check, Save, Trash2 } from "lucide-react";
import { PassportIcon } from "@/components/icons/passport-icon";
import { cn } from "@/lib/utils";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Republic of the)", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
];

const COUNTRY_PHONE_CODES: Record<string, string> = {
  "Afghanistan": "+93", "Albania": "+355", "Algeria": "+213", "Andorra": "+376", "Angola": "+244",
  "Antigua and Barbuda": "+1-268", "Argentina": "+54", "Armenia": "+374", "Australia": "+61", "Austria": "+43",
  "Azerbaijan": "+994", "Bahamas": "+1-242", "Bahrain": "+973", "Bangladesh": "+880", "Barbados": "+1-246",
  "Belarus": "+375", "Belgium": "+32", "Belize": "+501", "Benin": "+229", "Bhutan": "+975", "Bolivia": "+591",
  "Bosnia and Herzegovina": "+387", "Botswana": "+267", "Brazil": "+55", "Brunei": "+673", "Bulgaria": "+359",
  "Burkina Faso": "+226", "Burundi": "+257", "Cabo Verde": "+238", "Cambodia": "+855", "Cameroon": "+237",
  "Canada": "+1", "Central African Republic": "+236", "Chad": "+235", "Chile": "+56", "China": "+86",
  "Colombia": "+57", "Comoros": "+269", "Congo (Republic of the)": "+242", "Costa Rica": "+506",
  "Côte d'Ivoire": "+225", "Croatia": "+385", "Cuba": "+53", "Cyprus": "+357", "Czechia": "+420",
  "Democratic Republic of the Congo": "+243", "Denmark": "+45", "Djibouti": "+253", "Dominica": "+1-767",
  "Dominican Republic": "+1-809", "Ecuador": "+593", "Egypt": "+20", "El Salvador": "+503",
  "Equatorial Guinea": "+240", "Eritrea": "+291", "Estonia": "+372", "Eswatini": "+268", "Ethiopia": "+251",
  "Fiji": "+679", "Finland": "+358", "France": "+33", "Gabon": "+241", "Gambia": "+220", "Georgia": "+995",
  "Germany": "+49", "Ghana": "+233", "Greece": "+30", "Grenada": "+1-473", "Guatemala": "+502", "Guinea": "+224",
  "Guinea-Bissau": "+245", "Guyana": "+592", "Haiti": "+509", "Honduras": "+504", "Hungary": "+36",
  "Iceland": "+354", "India": "+91", "Indonesia": "+62", "Iran": "+98", "Iraq": "+964", "Ireland": "+353",
  "Israel": "+972", "Italy": "+39", "Jamaica": "+1-876", "Japan": "+81", "Jordan": "+962",
  "Kazakhstan": "+7", "Kenya": "+254", "Kiribati": "+686", "Kuwait": "+965", "Kyrgyzstan": "+996",
  "Laos": "+856", "Latvia": "+371", "Lebanon": "+961", "Lesotho": "+266", "Liberia": "+231", "Libya": "+218",
  "Liechtenstein": "+423", "Lithuania": "+370", "Luxembourg": "+352", "Madagascar": "+261", "Malawi": "+265",
  "Malaysia": "+60", "Maldives": "+960", "Mali": "+223", "Malta": "+356", "Marshall Islands": "+692",
  "Mauritania": "+222", "Mauritius": "+230", "Mexico": "+52", "Micronesia": "+691", "Moldova": "+373",
  "Monaco": "+377", "Mongolia": "+976", "Montenegro": "+382", "Morocco": "+212", "Mozambique": "+258",
  "Myanmar": "+95", "Namibia": "+264", "Nauru": "+674", "Nepal": "+977", "Netherlands": "+31",
  "New Zealand": "+64", "Nicaragua": "+505", "Niger": "+227", "Nigeria": "+234", "North Korea": "+850",
  "North Macedonia": "+389", "Norway": "+47", "Oman": "+968", "Pakistan": "+92", "Palau": "+680",
  "Palestine": "+970", "Panama": "+507", "Papua New Guinea": "+675", "Paraguay": "+595", "Peru": "+51",
  "Philippines": "+63", "Poland": "+48", "Portugal": "+351", "Qatar": "+974", "Romania": "+40",
  "Russia": "+7", "Rwanda": "+250", "Saint Kitts and Nevis": "+1-869", "Saint Lucia": "+1-758",
  "Saint Vincent and the Grenadines": "+1-784", "Samoa": "+685", "San Marino": "+378",
  "São Tomé and Príncipe": "+239", "Saudi Arabia": "+966", "Senegal": "+221", "Serbia": "+381",
  "Seychelles": "+248", "Sierra Leone": "+232", "Singapore": "+65", "Slovakia": "+421", "Slovenia": "+386",
  "Solomon Islands": "+677", "Somalia": "+252", "South Africa": "+27", "South Korea": "+82", "South Sudan": "+211",
  "Spain": "+34", "Sri Lanka": "+94", "Sudan": "+249", "Suriname": "+597", "Sweden": "+46", "Switzerland": "+41",
  "Syria": "+963", "Tajikistan": "+992", "Tanzania": "+255", "Thailand": "+66", "Timor-Leste": "+670",
  "Togo": "+228", "Tonga": "+676", "Trinidad and Tobago": "+1-868", "Tunisia": "+216", "Türkiye": "+90",
  "Turkmenistan": "+993", "Tuvalu": "+688", "Uganda": "+256", "Ukraine": "+380", "United Arab Emirates": "+971",
  "United Kingdom": "+44", "United States": "+1", "Uruguay": "+598", "Uzbekistan": "+998", "Vanuatu": "+678",
  "Venezuela": "+58", "Vietnam": "+84", "Yemen": "+967", "Zambia": "+260", "Zimbabwe": "+263",
};

const DEFAULT_PHONE_SEGMENTS = [3, 3, 4];

const COUNTRY_PHONE_FORMATS: Record<string, { code: string; segments: number[] }> = {
  "Afghanistan": { code: "+93", segments: [2, 3, 4] },
  "Albania": { code: "+355", segments: [2, 3, 4] },
  "Algeria": { code: "+213", segments: [2, 3, 4] },
  "Andorra": { code: "+376", segments: [3, 3] },
  "Angola": { code: "+244", segments: [3, 3, 3] },
  "Antigua and Barbuda": { code: "+1-268", segments: [3, 3, 4] },
  "Argentina": { code: "+54", segments: [2, 4, 4] },
  "Armenia": { code: "+374", segments: [2, 3, 3] },
  "Australia": { code: "+61", segments: [1, 4, 4] },
  "Austria": { code: "+43", segments: [3, 7] },
  "Azerbaijan": { code: "+994", segments: [2, 3, 4] },
  "Bahamas": { code: "+1-242", segments: [3, 3, 4] },
  "Bahrain": { code: "+973", segments: [4, 4] },
  "Bangladesh": { code: "+880", segments: [4, 6] },
  "Barbados": { code: "+1-246", segments: [3, 3, 4] },
  "Belarus": { code: "+375", segments: [2, 3, 4] },
  "Belgium": { code: "+32", segments: [3, 2, 2, 2] },
  "Belize": { code: "+501", segments: [3, 4] },
  "Benin": { code: "+229", segments: [2, 2, 2, 2] },
  "Bhutan": { code: "+975", segments: [1, 3, 4] },
  "Bolivia": { code: "+591", segments: [1, 3, 4] },
  "Bosnia and Herzegovina": { code: "+387", segments: [2, 3, 3] },
  "Botswana": { code: "+267", segments: [2, 3, 3] },
  "Brazil": { code: "+55", segments: [2, 5, 4] },
  "Brunei": { code: "+673", segments: [3, 4] },
  "Bulgaria": { code: "+359", segments: [2, 3, 4] },
  "Burkina Faso": { code: "+226", segments: [2, 2, 2, 2] },
  "Burundi": { code: "+257", segments: [2, 2, 4] },
  "Cabo Verde": { code: "+238", segments: [3, 4] },
  "Cambodia": { code: "+855", segments: [2, 3, 4] },
  "Cameroon": { code: "+237", segments: [4, 5] },
  "Canada": { code: "+1", segments: [3, 3, 4] },
  "Central African Republic": { code: "+236", segments: [2, 2, 2, 2] },
  "Chad": { code: "+235", segments: [2, 2, 2, 2] },
  "Chile": { code: "+56", segments: [1, 4, 4] },
  "China": { code: "+86", segments: [3, 4, 4] },
  "Colombia": { code: "+57", segments: [3, 3, 4] },
  "Comoros": { code: "+269", segments: [3, 4] },
  "Congo (Republic of the)": { code: "+242", segments: [2, 3, 4] },
  "Costa Rica": { code: "+506", segments: [4, 4] },
  "Côte d'Ivoire": { code: "+225", segments: [2, 2, 2, 4] },
  "Croatia": { code: "+385", segments: [2, 3, 4] },
  "Cuba": { code: "+53", segments: [1, 3, 4] },
  "Cyprus": { code: "+357", segments: [2, 3, 3] },
  "Czechia": { code: "+420", segments: [3, 3, 3] },
  "Democratic Republic of the Congo": { code: "+243", segments: [3, 3, 3] },
  "Denmark": { code: "+45", segments: [4, 4] },
  "Djibouti": { code: "+253", segments: [2, 2, 2, 2] },
  "Dominica": { code: "+1-767", segments: [3, 3, 4] },
  "Dominican Republic": { code: "+1-809", segments: [3, 3, 4] },
  "Ecuador": { code: "+593", segments: [2, 3, 4] },
  "Egypt": { code: "+20", segments: [3, 3, 4] },
  "El Salvador": { code: "+503", segments: [4, 4] },
  "Equatorial Guinea": { code: "+240", segments: [3, 3, 3] },
  "Eritrea": { code: "+291", segments: [1, 3, 3] },
  "Estonia": { code: "+372", segments: [4, 4] },
  "Eswatini": { code: "+268", segments: [4, 4] },
  "Ethiopia": { code: "+251", segments: [2, 3, 4] },
  "Fiji": { code: "+679", segments: [3, 4] },
  "Finland": { code: "+358", segments: [2, 3, 4] },
  "France": { code: "+33", segments: [1, 2, 2, 2, 2] },
  "Gabon": { code: "+241", segments: [1, 2, 2, 2] },
  "Gambia": { code: "+220", segments: [3, 4] },
  "Georgia": { code: "+995", segments: [3, 3, 3] },
  "Germany": { code: "+49", segments: [4, 7] },
  "Ghana": { code: "+233", segments: [2, 3, 4] },
  "Greece": { code: "+30", segments: [3, 3, 4] },
  "Grenada": { code: "+1-473", segments: [3, 3, 4] },
  "Guatemala": { code: "+502", segments: [4, 4] },
  "Guinea": { code: "+224", segments: [3, 3, 3] },
  "Guinea-Bissau": { code: "+245", segments: [3, 4] },
  "Guyana": { code: "+592", segments: [3, 4] },
  "Haiti": { code: "+509", segments: [4, 4] },
  "Honduras": { code: "+504", segments: [4, 4] },
  "Hungary": { code: "+36", segments: [2, 3, 4] },
  "Iceland": { code: "+354", segments: [3, 4] },
  "India": { code: "+91", segments: [5, 5] },
  "Indonesia": { code: "+62", segments: [3, 4, 4] },
  "Iran": { code: "+98", segments: [3, 3, 4] },
  "Iraq": { code: "+964", segments: [3, 3, 4] },
  "Ireland": { code: "+353", segments: [2, 3, 4] },
  "Israel": { code: "+972", segments: [2, 3, 4] },
  "Italy": { code: "+39", segments: [3, 3, 4] },
  "Jamaica": { code: "+1-876", segments: [3, 3, 4] },
  "Japan": { code: "+81", segments: [3, 4, 4] },
  "Jordan": { code: "+962", segments: [1, 4, 4] },
  "Kazakhstan": { code: "+7", segments: [3, 3, 4] },
  "Kenya": { code: "+254", segments: [3, 3, 3] },
  "Kiribati": { code: "+686", segments: [4, 4] },
  "Kuwait": { code: "+965", segments: [4, 4] },
  "Kyrgyzstan": { code: "+996", segments: [3, 3, 3] },
  "Laos": { code: "+856", segments: [2, 3, 4] },
  "Latvia": { code: "+371", segments: [4, 4] },
  "Lebanon": { code: "+961", segments: [1, 3, 4] },
  "Lesotho": { code: "+266", segments: [4, 4] },
  "Liberia": { code: "+231", segments: [3, 3, 4] },
  "Libya": { code: "+218", segments: [2, 3, 4] },
  "Liechtenstein": { code: "+423", segments: [3, 4] },
  "Lithuania": { code: "+370", segments: [3, 5] },
  "Luxembourg": { code: "+352", segments: [3, 3, 3] },
  "Madagascar": { code: "+261", segments: [2, 2, 3, 2] },
  "Malawi": { code: "+265", segments: [1, 4, 4] },
  "Malaysia": { code: "+60", segments: [2, 4, 4] },
  "Maldives": { code: "+960", segments: [3, 4] },
  "Mali": { code: "+223", segments: [4, 4] },
  "Malta": { code: "+356", segments: [4, 4] },
  "Marshall Islands": { code: "+692", segments: [3, 4] },
  "Mauritania": { code: "+222", segments: [4, 4] },
  "Mauritius": { code: "+230", segments: [4, 4] },
  "Mexico": { code: "+52", segments: [3, 3, 4] },
  "Micronesia": { code: "+691", segments: [3, 4] },
  "Moldova": { code: "+373", segments: [2, 3, 3] },
  "Monaco": { code: "+377", segments: [4, 5] },
  "Mongolia": { code: "+976", segments: [4, 4] },
  "Montenegro": { code: "+382", segments: [2, 3, 3] },
  "Morocco": { code: "+212", segments: [2, 3, 4] },
  "Mozambique": { code: "+258", segments: [2, 3, 4] },
  "Myanmar": { code: "+95", segments: [1, 3, 5] },
  "Namibia": { code: "+264", segments: [2, 3, 4] },
  "Nauru": { code: "+674", segments: [3, 4] },
  "Nepal": { code: "+977", segments: [3, 3, 4] },
  "Netherlands": { code: "+31", segments: [2, 3, 4] },
  "New Zealand": { code: "+64", segments: [2, 3, 4] },
  "Nicaragua": { code: "+505", segments: [4, 4] },
  "Niger": { code: "+227", segments: [4, 4] },
  "Nigeria": { code: "+234", segments: [3, 3, 4] },
  "North Korea": { code: "+850", segments: [4, 3, 4] },
  "North Macedonia": { code: "+389", segments: [2, 3, 3] },
  "Norway": { code: "+47", segments: [4, 4] },
  "Oman": { code: "+968", segments: [4, 4] },
  "Pakistan": { code: "+92", segments: [3, 3, 4] },
  "Palau": { code: "+680", segments: [3, 4] },
  "Palestine": { code: "+970", segments: [2, 3, 4] },
  "Panama": { code: "+507", segments: [4, 4] },
  "Papua New Guinea": { code: "+675", segments: [4, 4] },
  "Paraguay": { code: "+595", segments: [3, 3, 3] },
  "Peru": { code: "+51", segments: [3, 3, 3] },
  "Philippines": { code: "+63", segments: [3, 3, 4] },
  "Poland": { code: "+48", segments: [3, 3, 3] },
  "Portugal": { code: "+351", segments: [3, 3, 3] },
  "Qatar": { code: "+974", segments: [4, 4] },
  "Romania": { code: "+40", segments: [3, 3, 3] },
  "Russia": { code: "+7", segments: [3, 3, 4] },
  "Rwanda": { code: "+250", segments: [3, 3, 3] },
  "Saint Kitts and Nevis": { code: "+1-869", segments: [3, 3, 4] },
  "Saint Lucia": { code: "+1-758", segments: [3, 3, 4] },
  "Saint Vincent and the Grenadines": { code: "+1-784", segments: [3, 3, 4] },
  "Samoa": { code: "+685", segments: [2, 5] },
  "San Marino": { code: "+378", segments: [4, 6] },
  "São Tomé and Príncipe": { code: "+239", segments: [3, 4] },
  "Saudi Arabia": { code: "+966", segments: [2, 3, 4] },
  "Senegal": { code: "+221", segments: [2, 3, 4] },
  "Serbia": { code: "+381", segments: [2, 3, 4] },
  "Seychelles": { code: "+248", segments: [1, 2, 4] },
  "Sierra Leone": { code: "+232", segments: [2, 3, 3] },
  "Singapore": { code: "+65", segments: [4, 4] },
  "Slovakia": { code: "+421", segments: [3, 3, 3] },
  "Slovenia": { code: "+386", segments: [2, 3, 3] },
  "Solomon Islands": { code: "+677", segments: [3, 4] },
  "Somalia": { code: "+252", segments: [2, 3, 4] },
  "South Africa": { code: "+27", segments: [2, 3, 4] },
  "South Korea": { code: "+82", segments: [2, 4, 4] },
  "South Sudan": { code: "+211", segments: [3, 3, 3] },
  "Spain": { code: "+34", segments: [3, 3, 3] },
  "Sri Lanka": { code: "+94", segments: [2, 3, 4] },
  "Sudan": { code: "+249", segments: [2, 3, 4] },
  "Suriname": { code: "+597", segments: [3, 4] },
  "Sweden": { code: "+46", segments: [2, 3, 4] },
  "Switzerland": { code: "+41", segments: [2, 3, 4] },
  "Syria": { code: "+963", segments: [3, 3, 3] },
  "Tajikistan": { code: "+992", segments: [3, 3, 3] },
  "Tanzania": { code: "+255", segments: [3, 3, 3] },
  "Thailand": { code: "+66", segments: [1, 4, 4] },
  "Timor-Leste": { code: "+670", segments: [4, 4] },
  "Togo": { code: "+228", segments: [2, 2, 2, 2] },
  "Tonga": { code: "+676", segments: [3, 4] },
  "Trinidad and Tobago": { code: "+1-868", segments: [3, 3, 4] },
  "Tunisia": { code: "+216", segments: [2, 3, 3] },
  "Türkiye": { code: "+90", segments: [3, 3, 4] },
  "Turkmenistan": { code: "+993", segments: [2, 5] },
  "Tuvalu": { code: "+688", segments: [2, 4] },
  "Uganda": { code: "+256", segments: [3, 3, 3] },
  "Ukraine": { code: "+380", segments: [2, 3, 4] },
  "United Arab Emirates": { code: "+971", segments: [2, 3, 4] },
  "United Kingdom": { code: "+44", segments: [4, 6] },
  "United States": { code: "+1", segments: [3, 3, 4] },
  "Uruguay": { code: "+598", segments: [1, 3, 4] },
  "Uzbekistan": { code: "+998", segments: [2, 3, 4] },
  "Vanuatu": { code: "+678", segments: [3, 4] },
  "Venezuela": { code: "+58", segments: [3, 3, 4] },
  "Vietnam": { code: "+84", segments: [3, 3, 4] },
  "Yemen": { code: "+967", segments: [3, 3, 3] },
  "Zambia": { code: "+260", segments: [2, 3, 4] },
  "Zimbabwe": { code: "+263", segments: [2, 3, 4] },
};

const PERSONALITY_OPTIONS = [
  { group: "🧠 Analysts", items: [
    { id: "INTJ", title: "Architect", desc: "Plans a hyper-efficient, optimized itinerary months in advance and quietly experiences each destination with strategic precision." },
    { id: "INTP", title: "Logician", desc: "Spends half the trip researching the history, culture, and philosophy of the place and the other half wandering thoughtfully off-schedule." },
    { id: "ENTJ", title: "Commander", desc: "Turns the group trip into a flawlessly executed global operation with bookings, backup plans, and ambitious goals." },
    { id: "ENTP", title: "Debater", desc: "Books the trip last minute, befriends strangers immediately, and somehow ends up at the most unexpected underground event." },
  ]},
  { group: "💛 Diplomats", items: [
    { id: "INFJ", title: "Advocate", desc: "Seeks deeply meaningful cultural experiences and hidden spots that feel authentic and transformative." },
    { id: "INFP", title: "Mediator", desc: "Wanders poetic streets, journals in cafés, and chases emotional, soul-stirring moments over tourist checklists." },
    { id: "ENFJ", title: "Protagonist", desc: "Curates experiences everyone will love and connects deeply with locals wherever they go." },
    { id: "ENFP", title: "Campaigner", desc: "Travels with boundless excitement, says yes to everything, and collects spontaneous stories in every city." },
  ]},
  { group: "🛡 Sentinels", items: [
    { id: "ISTJ", title: "Logistician", desc: "Researches thoroughly, follows a structured plan, and ensures nothing important gets missed." },
    { id: "ISFJ", title: "Defender", desc: "Prioritizes comfort, thoughtful planning, and making sure everyone feels safe and happy." },
    { id: "ESTJ", title: "Executive", desc: "Keeps the group organized, on schedule, and maximizing every single day abroad." },
    { id: "ESFJ", title: "Consul", desc: "Builds warm connections everywhere and turns every trip into a shared memory event." },
  ]},
  { group: "🎨 Explorers", items: [
    { id: "ISTP", title: "Virtuoso", desc: "Explores independently, tries adventurous activities, and figures things out on the fly." },
    { id: "ISFP", title: "Adventurer", desc: "Soaks in beautiful scenery, local art, and sensory experiences with quiet appreciation." },
    { id: "ESTP", title: "Entrepreneur", desc: "Seeks thrill, nightlife, action sports, and bold experiences wherever they land." },
    { id: "ESFP", title: "Entertainer", desc: "Finds the party, makes new friends instantly, and lives fully in every moment of the trip." },
  ]},
];

type SettingsTab = "account" | "travel" | "maps" | "integrations" | "notifications";

const TABS: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "account", label: "Account", icon: User },
  { id: "travel", label: "Travel Preferences", icon: Plane },
  { id: "maps", label: "Token Usage", icon: Coins },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "notifications", label: "Notifications", icon: Bell },
];

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [personality, setPersonality] = useState<{ id: string; title: string } | null>(null);
  const [password, setPassword] = useState("");
  const [personalityOpen, setPersonalityOpen] = useState(false);
  const [baseCountry, setBaseCountry] = useState<string | null>(null);
  const [baseCountryOpen, setBaseCountryOpen] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneParts, setPhoneParts] = useState<string[]>([]);

  const phoneSegments = baseCountry && COUNTRY_PHONE_FORMATS[baseCountry]
    ? COUNTRY_PHONE_FORMATS[baseCountry].segments
    : DEFAULT_PHONE_SEGMENTS;

  useEffect(() => {
    if (baseCountry && COUNTRY_PHONE_FORMATS[baseCountry]) {
      const { code, segments } = COUNTRY_PHONE_FORMATS[baseCountry];
      setPhoneCode(code);
      setPhoneParts(segments.map(() => ""));
    } else if (baseCountry && COUNTRY_PHONE_CODES[baseCountry]) {
      setPhoneCode(COUNTRY_PHONE_CODES[baseCountry]);
      setPhoneParts(DEFAULT_PHONE_SEGMENTS.map(() => ""));
    }
  }, [baseCountry]);

  const setPhonePart = (index: number, value: string) => {
    setPhoneParts((prev) => {
      const next = [...(prev.length >= phoneSegments.length ? prev : phoneSegments.map(() => ""))];
      next[index] = value.replace(/\D/g, "").slice(0, phoneSegments[index]);
      return next;
    });
  };

  const passwordValid = !password || PASSWORD_REGEX.test(password);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col [&>button]:right-4 [&>button]:top-4 [&>button]:z-10">
        <DialogTitle className="sr-only">Passport</DialogTitle>
        <div className="relative flex-1 min-h-0 flex overflow-hidden">
          <aside className="absolute left-0 top-0 bottom-0 z-10 w-[240px] flex flex-col border-r-2 border-border bg-muted/40">
            <div className="shrink-0 p-3 border-b-2 border-border flex items-center">
              <h2 className="font-departure-mono text-lg font-semibold">Passport</h2>
              <PassportIcon className="h-5 w-5 shrink-0 ml-[100px]" />
            </div>
            <nav className="flex-1 overflow-y-auto py-2 min-h-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors font-departure-mono whitespace-nowrap text-left",
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <ScrollArea className="flex-1 min-w-0 pl-[240px]">
            <div className="p-6 pt-14">
              {activeTab === "account" && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Name</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input id="first-name" placeholder="First name" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                        <Input id="last-name" placeholder="Last name" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="font-departure-mono">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="font-departure-mono">Password</Label>
                      <p className="text-xs text-muted-foreground font-departure-mono whitespace-nowrap">
                        min 8 characters, 1 upper/lowercase, 1 special character
                      </p>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(
                          "font-wenkai-mono-bold placeholder:font-wenkai-mono-bold",
                          !passwordValid && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {!passwordValid && password && (
                        <p className="text-xs text-destructive font-departure-mono">Password does not meet requirements</p>
                      )}
                      {passwordValid && password && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                          <Check className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-departure-mono" title="password is good to go!">
                            password is good to go!
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Country of Residence</Label>
                      <Popover open={baseCountryOpen} onOpenChange={setBaseCountryOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between font-wenkai-mono-bold h-9"
                          >
                            {baseCountry ?? "Select country"}
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] max-h-[320px] p-0 overflow-hidden"
                          side="bottom"
                          align="start"
                          onWheel={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                        >
                          <div className="max-h-[320px] overflow-y-auto overscroll-contain min-h-0">
                            <div className="p-2">
                              {COUNTRIES.map((country) => {
                                const isSelected = baseCountry === country;
                                return (
                                  <button
                                    key={country}
                                    type="button"
                                    onClick={() => {
                                      setBaseCountry(country);
                                      setBaseCountryOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors font-wenkai-mono-bold",
                                      "focus:outline-none",
                                      isSelected
                                        ? "bg-accent shadow-md"
                                        : "hover:bg-muted focus:bg-muted"
                                    )}
                                  >
                                    {country}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Phone number</Label>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Input
                          value={phoneCode}
                          onChange={(e) => setPhoneCode(e.target.value)}
                          placeholder="+1"
                          className="w-24 font-wenkai-mono-bold placeholder:font-wenkai-mono-bold shrink-0"
                        />
                        {phoneSegments.map((len, i) => (
                          <Input
                            key={i}
                            value={phoneParts[i] ?? ""}
                            onChange={(e) => setPhonePart(i, e.target.value)}
                            placeholder={"X".repeat(len)}
                            type="tel"
                            maxLength={len}
                            className={cn(
                              "font-wenkai-mono-bold placeholder:font-wenkai-mono-bold text-center",
                              len <= 2 ? "w-10" : len <= 4 ? "w-14" : len <= 5 ? "w-16" : "w-20"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Personality</Label>
                      <p className="text-xs text-muted-foreground font-departure-mono whitespace-nowrap">MBTI type – acronym and description</p>
                      <Popover open={personalityOpen} onOpenChange={setPersonalityOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between font-departure-mono h-auto min-h-9 py-2"
                          >
                            {personality ? (
                              <Badge variant="secondary" className="font-departure-mono">
                                {personality.id} – {personality.title}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">Select personality type</span>
                            )}
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] max-h-[320px] p-0 overflow-hidden"
                            side="bottom"
                            align="start"
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                          >
                          <div className="max-h-[320px] overflow-y-auto overscroll-contain min-h-0">
                            <div className="p-2 space-y-4">
                              {PERSONALITY_OPTIONS.map((group) => (
                                <div key={group.group}>
                                  <p className="px-2 py-1 text-xs font-departure-mono font-semibold text-muted-foreground">
                                    {group.group}
                                  </p>
                                  <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isSelected = personality?.id === item.id;
                                        return (
                                          <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                              setPersonality({ id: item.id, title: item.title });
                                              setPersonalityOpen(false);
                                            }}
                                            className={cn(
                                              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors focus:outline-none",
                                              isSelected && "bg-accent shadow-md"
                                            )}
                                          >
                                        <span className="font-departure-mono font-medium">
                                          {item.id} – {item.title}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-departure-mono">
                                          {item.desc}
                                        </p>
                                      </button>
                                        );
                                      })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                      <Save className="h-4 w-4 shrink-0" />
                      Save
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 shrink-0" />
                      Delete account
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "travel" && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Preferred airports</Label>
                      <Input placeholder="e.g. JFK, LGA, EWR" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Seat class</Label>
                      <Input placeholder="Economy / Business / First" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Hotel level</Label>
                      <Input placeholder="Budget / Standard / Luxury" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Dietary restrictions</Label>
                      <Input placeholder="e.g. Vegetarian, Gluten-free" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Accessibility needs</Label>
                      <Input placeholder="Any accessibility requirements" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Favorite airlines</Label>
                      <Input placeholder="e.g. Delta, United" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Favorite hotel chains</Label>
                      <Input placeholder="e.g. Marriott, Hilton" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                </div>
              )}

              {activeTab === "maps" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-departure-mono">Daily maps remaining</span>
                      <span className="font-departure-mono">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-departure-mono">Refill date</span>
                      <span className="font-departure-mono">Tomorrow</span>
                    </div>
                    <Button>Upgrade plan</Button>
                </div>
              )}

              {activeTab === "integrations" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium font-departure-mono">Gmail / Outlook</p>
                        <p className="text-sm text-muted-foreground font-departure-mono">Import reservations from email</p>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium font-departure-mono">Calendar sync</p>
                        <p className="text-sm text-muted-foreground font-departure-mono">Sync trips to your calendar</p>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between opacity-60">
                      <div>
                        <p className="font-medium font-departure-mono">WhatsApp</p>
                        <p className="text-sm text-muted-foreground font-departure-mono">Future agent messaging</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Coming soon</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between opacity-60">
                      <div>
                        <p className="font-medium font-departure-mono">iMessage</p>
                        <p className="text-sm text-muted-foreground font-departure-mono">Future agent messaging</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Coming soon</Button>
                    </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="booking" className="font-departure-mono">Booking confirmations</Label>
                      <Switch id="booking" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="price" className="font-departure-mono">Price drops</Label>
                      <Switch id="price" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="itinerary" className="font-departure-mono">Itinerary changes</Label>
                      <Switch id="itinerary" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reminders" className="font-departure-mono">Travel reminders</Label>
                      <Switch id="reminders" defaultChecked />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
