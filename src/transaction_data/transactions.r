library(tidyverse)
library(readxl)
library(GetoptLong)

readFromExcel <- function(stateAbbreviation, stateName) {
  read_xls(qq('whaples/Wilco@{stateAbbreviation}.xls')) %>%
    mutate(State = stateName)
}

VA <- readFromExcel('VA', 'Virginia')
TN <- readFromExcel('TN', 'Tennessee')
SC <- readFromExcel('SC', 'South Carolina')
PA <- readFromExcel('PA', 'Pennsylvania')
NC <- readFromExcel('NC', 'North Carolina')
GA <- readFromExcel('GA', 'Georgia')
AL <- readFromExcel('AL', 'Alabama')

combined <- full_join(VA, TN) %>%
  full_join(.,SC) %>%
  full_join(.,PA) %>%
  full_join(.,NC) %>%
  full_join(.,GA) %>%
  full_join(.,AL)

save(combined, file='combined_whaples.rdata')
load('combined_whaples.rdata')

combined <- filter(combined, sign(`Post-Tax Amount`) == 1) %>%
  select(pre_tax_amount = `Pre-Tax Amount`, tax = `Tax`, post_tax_amount = `Post-Tax Amount`, amount_tendered = `Amount Tendered`)
    
sample_n(combined,size=3600, replace = FALSE) %>%
  write_csv('whaples_sample.csv')

  write_csv(lombra, 'lombra_sample.csv')
