package com.example.application.data.endpoint;

import com.example.application.data.entity.Company;
import com.example.application.data.entity.Contact;
import com.example.application.data.entity.Status;
import com.example.application.data.repository.CompanyRepository;
import com.example.application.data.repository.ContactRepository;
import com.example.application.data.repository.StatusRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

import javax.annotation.security.PermitAll;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Endpoint
@PermitAll
public class CrmEndpoint {

    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;
    private final StatusRepository statusRepository;

    public CrmEndpoint(ContactRepository contactRepository, CompanyRepository companyRepository, StatusRepository statusRepository) {
        this.contactRepository = contactRepository;
        this.companyRepository = companyRepository;
        this.statusRepository = statusRepository;
    }

    @Nonnull
    public CrmData getCrmData() {
        CrmData crmData = new CrmData();
        crmData.contacts = contactRepository.findAll();
        crmData.companies = companyRepository.findAll();
        crmData.statuses = statusRepository.findAll();
        return crmData;
    }

    @Nonnull
    public Contact saveContact(Contact contact) {
        UUID companyId = contact.getCompany().getId();
        contact.setCompany(companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Could not find company with id " + companyId)));

        UUID statusId = contact.getStatus().getId();
        contact.setStatus(statusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("Could not find status with id " + statusId)));

        return contactRepository.save(contact);
    }

    public void deleteContact(UUID contactId) {
        contactRepository.deleteById(contactId);
    }

    public static class CrmData {
        @Nonnull
        public List<Contact> contacts = Collections.emptyList();
        @Nonnull
        public List<Company> companies = Collections.emptyList();
        @Nonnull
        public List<Status> statuses = Collections.emptyList();
    }
}


