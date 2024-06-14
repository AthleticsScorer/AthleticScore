class EventStatistics:
    def __init__(self, national_record, national_standard, entry_standard, county_standard):
        self.national_record = national_record
        self.national_standard = national_standard
        self.entry_standard = entry_standard
        self.county_standard = county_standard
        self.xmean = self.calculate_mean()
        self.gradient = self.calculate_gradient()
        self.y_intercept = self.calculate_y_intercept()

    def calculate_mean(self) -> float:
        return (self.national_record + self.national_standard + self.entry_standard + self.county_standard) / 4

    def calculate_gradient(self) -> float:
        mean = self.xmean
        numerator = 1 * self.national_record + 2 * self.national_standard + 3 * self.entry_standard + 4 * self.county_standard - 10 * mean
        denominator = self.national_record**2 + self.national_standard**2 + self.entry_standard**2 + self.county_standard**2 - 4 * (mean**2)
        return numerator / denominator if denominator != 0 else 0

    def calculate_y_intercept(self) -> float:
        return 2.5 - self.xmean * self.gradient
    
    def calculate_performance(self, score: float) -> float:
        return self.y_intercept + self.gradient * score

    def __repr__(self):
        return (f"national_record={self.national_record}, national_standard={self.national_standard}, "
                f"entry_standard={self.entry_standard}, county_standard={self.county_standard}, "
                f"xmean={self.xmean}, gradient={self.gradient}, y_intercept={self.y_intercept})")

event_statistics = {
    "Hurdles" : EventStatistics(
        national_record=14,
        national_standard=14.6,
        entry_standard=15.2,
        county_standard=16.2
    ),

    "100m" : EventStatistics(
        national_record=10.7,
        national_standard=10.9,
        entry_standard=11.1,
        county_standard=11.5
    ),

    "200m" : EventStatistics(
        national_record=21.6,
        national_standard=21.9,
        entry_standard=22.2,
        county_standard=23.3
    ),

    "400m" : EventStatistics(
        national_record=48.1,
        national_standard=48.8,
        entry_standard=49.5,
        county_standard=52.5
    ),

    "800m" : EventStatistics(
        national_record=110,
        national_standard=112,
        entry_standard=114,
        county_standard=122
    ),

    "1500m" : EventStatistics(
        national_record=232,
        national_standard=235,
        entry_standard=238,
        county_standard=255
    ),

    "2k Steeplechase" : EventStatistics(
        national_record=358,
        national_standard=364,
        entry_standard=370,
        county_standard=390
    ),
    "Discus" : EventStatistics(
        national_record=0,
        national_standard=0,
        entry_standard=0,
        county_standard=0
    ),
    "Shot Put" : EventStatistics(
        national_record=15,
        national_standard=14,
        entry_standard=13,
        county_standard=11.5
    ),

    "Javelin" : EventStatistics(
        national_record=60,
        national_standard=56,
        entry_standard=52,
        county_standard=46
    ),

    "High Jump" : EventStatistics(
        national_record=2.06,
        national_standard=2,
        entry_standard=1.94,
        county_standard=1.83
    ),

    "Long Jump" : EventStatistics(
        national_record=7,
        national_standard=6.9,
        entry_standard=6.8,
        county_standard=6.25
    ),

    "Triple Jump" : EventStatistics(
        national_record=14.9,
        national_standard=14.4,
        entry_standard=13.9,
        county_standard=12.85
    ),
}