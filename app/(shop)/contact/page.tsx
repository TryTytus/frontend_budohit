import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Clock, CreditCard, Building2, Globe } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="container py-12 flex-1">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Skontaktuj się z nami</h1>
                        <p className="text-muted-foreground text-lg">
                            Jesteśmy do Twojej dyspozycji od poniedziałku do piątku w godzinach 8:00 - 16:00.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Company Info Card */}
                        <div className="bg-card border rounded-xl p-8 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 pb-4 border-b">
                                <Building2 className="h-6 w-6 text-primary" />
                                <h2 className="text-xl font-semibold">Dane Firmy</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-foreground">BUDOHIT Sp. z.o.o.</h3>
                                    <p className="text-sm text-muted-foreground">NIP: 634-288-28-68</p>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p>Al. Walentego Roździeńskiego 188a</p>
                                        <p>40-203 Katowice, Polska</p>
                                        <Link
                                            href="https://www.google.com/maps/place/Budohit.+Elektronarz%C4%99dzia,+zamocowania+budowlano+-+instalacyjne,+ci%C4%99cie+betonu/@50.2661934,19.0579394,17z/data=!4m6!3m5!1s0x4716cfda6f9306dd:0x8750c974004668e7!8m2!3d50.2662049!4d19.0578753!16s%2Fg%2F1tfqpps0?authuser=0"
                                            target="_blank"
                                            className="text-primary text-sm hover:underline inline-block mt-1"
                                        >
                                            Jak dojechać? &rarr;
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start pt-2">
                                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <a href="https://budohit.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                        budohit.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bank & Hours Card */}
                        <div className="space-y-8">
                            {/* Opening Hours */}
                            <div className="bg-card border rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold">Godziny Otwarcia</h3>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Poniedziałek - Piątek</span>
                                    <span className="font-medium">8:00 - 16:00</span>
                                </div>
                            </div>

                            {/* Bank Details */}
                            <div className="bg-card border rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold">Dane Bankowe</h3>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p className="text-muted-foreground">ING Bank Śląski SA</p>
                                    <p className="font-mono font-medium text-base tracking-wide select-all">
                                        79 1050 1214 1000 0090 3127 5739
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Contact Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Sales & Service */}
                        <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                            <h3 className="font-semibold border-b pb-2">Dział Handlowy & Serwis</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <div className="space-y-0.5">
                                        <a href="tel:+48695366111" className="block font-medium hover:text-primary transition-colors">+48 695 366 111</a>
                                        <p className="text-xs text-muted-foreground">Kierownik ds. sprzedaży / Serwis / Wynajem</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <div className="space-y-0.5">
                                        <a href="tel:+48322091190" className="block font-medium hover:text-primary transition-colors">+48 32 209 11 90</a>
                                        <p className="text-xs text-muted-foreground">Dział handlowy / Księgowość</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <div className="space-y-0.5">
                                        <a href="tel:+48695111334" className="block font-medium hover:text-primary transition-colors">+48 695 111 334</a>
                                        <p className="text-xs text-muted-foreground">Doradca techniczno-handlowy</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Construction Services */}
                        <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                            <h3 className="font-semibold border-b pb-2">Usługi Budowlane</h3>
                            <p className="text-xs text-muted-foreground mb-4">Cięcie, wiercenie, prace specjalistyczne</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <a href="tel:+48601066111" className="font-medium hover:text-primary transition-colors">+48 601 066 111</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <a href="tel:+48695366111" className="font-medium hover:text-primary transition-colors">+48 695 366 111</a>
                                </div>
                            </div>
                        </div>

                        {/* Email Contact */}
                        <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                            <h3 className="font-semibold border-b pb-2">Adresy Email</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <a href="mailto:budohit@budohit.pl" className="font-medium hover:text-primary transition-colors">budohit@budohit.pl</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <a href="mailto:patryk@budohit.pl" className="font-medium hover:text-primary transition-colors">patryk@budohit.pl</a>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}
