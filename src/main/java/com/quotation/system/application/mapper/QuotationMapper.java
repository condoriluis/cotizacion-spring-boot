package com.quotation.system.application.mapper;

import com.quotation.system.application.dto.QuotationDTO;
import com.quotation.system.application.dto.QuotationItemDTO;
import com.quotation.system.domain.model.Quotation;
import com.quotation.system.domain.model.QuotationItem;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuotationMapper {
    QuotationDTO toDto(Quotation quotation);
    Quotation toDomain(QuotationDTO quotationDTO);
    List<QuotationDTO> toDtoList(List<Quotation> quotations);

    QuotationItemDTO itemToDto(QuotationItem item);
    QuotationItem itemToDomain(QuotationItemDTO itemDTO);
}
